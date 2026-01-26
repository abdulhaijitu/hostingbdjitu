import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AppRole = 'customer' | 'admin';

// Role resolution states
type RoleState = 
  | { status: 'idle' }           // No user, no role needed
  | { status: 'loading' }        // User exists, fetching role
  | { status: 'resolved'; role: AppRole }  // Role successfully fetched
  | { status: 'error'; error: string };    // Role fetch failed

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  loading: boolean;        // Auth is initializing
  authReady: boolean;      // Auth has been initialized
  roleLoading: boolean;    // Role is being fetched
  roleError: string | null; // Role fetch error
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  refreshSession: () => Promise<void>;
  retryRoleFetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cache for role to prevent refetching
const roleCache = new Map<string, AppRole>();

// Session refresh interval (45 minutes - before 1 hour expiry)
const SESSION_REFRESH_INTERVAL = 45 * 60 * 1000;

// Auth initialization timeout
const AUTH_INIT_TIMEOUT = 5000;

// Retry configuration for role fetch
const ROLE_FETCH_MAX_RETRIES = 3;
const ROLE_FETCH_BASE_DELAY = 1000; // 1 second base delay

// Helper: delay with exponential backoff
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const getBackoffDelay = (attempt: number) => ROLE_FETCH_BASE_DELAY * Math.pow(2, attempt);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roleState, setRoleState] = useState<RoleState>({ status: 'idle' });
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  
  // Refs for cleanup and preventing race conditions
  const mountedRef = useRef(true);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);
  const currentFetchRef = useRef<string | null>(null);
  const retryCountRef = useRef(0);

  // Derived state from roleState
  const role = roleState.status === 'resolved' ? roleState.role : null;
  const roleLoading = roleState.status === 'loading';
  const roleError = roleState.status === 'error' ? roleState.error : null;
  const isAdmin = role === 'admin';

  const fetchUserRole = useCallback(async (userId: string, forceRefresh = false): Promise<AppRole | null> => {
    // Check cache first (unless force refresh)
    if (!forceRefresh && roleCache.has(userId)) {
      const cachedRole = roleCache.get(userId)!;
      if (mountedRef.current) {
        setRoleState({ status: 'resolved', role: cachedRole });
      }
      retryCountRef.current = 0;
      return cachedRole;
    }

    // Skip if already fetching for this user (unless force refresh)
    if (!forceRefresh && currentFetchRef.current === userId && roleState.status === 'loading') {
      return null;
    }
    
    currentFetchRef.current = userId;
    
    if (mountedRef.current) {
      setRoleState({ status: 'loading' });
    }

    // Attempt fetch with exponential backoff retry
    let lastError: string | null = null;
    
    for (let attempt = 0; attempt <= ROLE_FETCH_MAX_RETRIES; attempt++) {
      if (!mountedRef.current) {
        currentFetchRef.current = null;
        return null;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .maybeSingle();

        if (!mountedRef.current) {
          currentFetchRef.current = null;
          return null;
        }

        if (error) {
          lastError = error.message;
          console.warn(`Role fetch attempt ${attempt + 1}/${ROLE_FETCH_MAX_RETRIES + 1} failed:`, error.message);
          
          // If not the last attempt, wait and retry
          if (attempt < ROLE_FETCH_MAX_RETRIES) {
            const backoffDelay = getBackoffDelay(attempt);
            console.log(`Retrying in ${backoffDelay}ms...`);
            await delay(backoffDelay);
            continue;
          }
          
          // All retries exhausted
          console.error('Role fetch failed after all retries:', error.message);
          setRoleState({ status: 'error', error: error.message });
          currentFetchRef.current = null;
          retryCountRef.current = 0;
          return null;
        }

        // Success! Default to customer if no role record found
        const userRole: AppRole = (data?.role as AppRole) || 'customer';
        
        // Cache the result
        roleCache.set(userId, userRole);
        setRoleState({ status: 'resolved', role: userRole });
        currentFetchRef.current = null;
        retryCountRef.current = 0;
        
        if (attempt > 0) {
          console.log(`Role fetch succeeded on attempt ${attempt + 1}`);
        }
        
        return userRole;
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
        console.warn(`Role fetch attempt ${attempt + 1}/${ROLE_FETCH_MAX_RETRIES + 1} exception:`, lastError);
        
        // If not the last attempt, wait and retry
        if (attempt < ROLE_FETCH_MAX_RETRIES) {
          const backoffDelay = getBackoffDelay(attempt);
          console.log(`Retrying in ${backoffDelay}ms...`);
          await delay(backoffDelay);
          continue;
        }
      }
    }

    // All retries exhausted with exception
    console.error('Role fetch failed after all retries');
    if (mountedRef.current) {
      setRoleState({ 
        status: 'error', 
        error: lastError || 'রোল লোড করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।'
      });
    }
    currentFetchRef.current = null;
    retryCountRef.current = 0;
    return null;
  }, [roleState.status]);

  // Retry role fetch function (manual retry)
  const retryRoleFetch = useCallback(async () => {
    if (!user?.id) return;
    
    // Clear cache for this user
    roleCache.delete(user.id);
    currentFetchRef.current = null;
    retryCountRef.current = 0;
    
    await fetchUserRole(user.id, true);
  }, [user?.id, fetchUserRole]);

  // Session refresh function
  const refreshSession = useCallback(async () => {
    if (isRefreshingRef.current || !mountedRef.current) return;
    
    isRefreshingRef.current = true;
    
    try {
      const { data: { session: newSession }, error } = await supabase.auth.refreshSession();
      
      if (!mountedRef.current) return;
      
      if (error) {
        if (error.message.includes('refresh_token_not_found') || 
            error.message.includes('Invalid Refresh Token')) {
          await supabase.auth.signOut();
          setUser(null);
          setSession(null);
          setRoleState({ status: 'idle' });
        }
        return;
      }
      
      if (newSession) {
        setSession(newSession);
        setUser(newSession.user);
      }
    } catch (error) {
      // Silent fail for session refresh
    } finally {
      isRefreshingRef.current = false;
    }
  }, []);

  // Setup session refresh interval
  const setupRefreshInterval = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
    
    refreshIntervalRef.current = setInterval(() => {
      if (session && mountedRef.current) {
        refreshSession();
      }
    }, SESSION_REFRESH_INTERVAL);
  }, [session, refreshSession]);

  // Handle auth state changes
  const handleAuthChange = useCallback(async (event: AuthChangeEvent, newSession: Session | null) => {
    if (!mountedRef.current) return;
    
    // Update session and user
    setSession(newSession);
    setUser(newSession?.user ?? null);

    if (newSession?.user) {
      // Fetch role for the user
      await fetchUserRole(newSession.user.id);
      setupRefreshInterval();
    } else {
      // No user - reset role state to idle
      setRoleState({ status: 'idle' });
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    }

    // Mark auth as ready
    if (!authReady && mountedRef.current) {
      setLoading(false);
      setAuthReady(true);
    }
  }, [fetchUserRole, authReady, setupRefreshInterval]);

  useEffect(() => {
    mountedRef.current = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (!mountedRef.current) return;

        if (existingSession?.user) {
          setSession(existingSession);
          setUser(existingSession.user);
          
          await fetchUserRole(existingSession.user.id);
          setupRefreshInterval();
        } else {
          // No session - role state stays idle
          setRoleState({ status: 'idle' });
        }
      } catch (error) {
        setRoleState({ status: 'idle' });
      } finally {
        if (mountedRef.current) {
          setLoading(false);
          setAuthReady(true);
        }
      }
    };

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Then initialize auth
    initializeAuth();

    // Failsafe timeout
    initTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current && !authReady) {
        setLoading(false);
        setAuthReady(true);
      }
    }, AUTH_INIT_TIMEOUT);

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && session && mountedRef.current) {
        const expiresAt = session.expires_at;
        if (expiresAt) {
          const expiresIn = expiresAt * 1000 - Date.now();
          if (expiresIn < 10 * 60 * 1000) {
            refreshSession();
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
      
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchUserRole, handleAuthChange, authReady, setupRefreshInterval, refreshSession, session]);

  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: fullName || '' },
        },
      });

      return { error: error as Error | null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    // Set role loading state immediately
    setRoleState({ status: 'loading' });
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setRoleState({ status: 'idle' });
      }

      return { error: error as Error | null };
    } catch (error) {
      setRoleState({ status: 'idle' });
      return { error: error as Error };
    }
  }, []);

  const signOut = useCallback(async () => {
    // Clear role cache on sign out
    if (user?.id) {
      roleCache.delete(user.id);
    }
    
    currentFetchRef.current = null;
    
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
    
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRoleState({ status: 'idle' });
  }, [user?.id]);

  const value = useMemo(() => ({
    user,
    session,
    role,
    loading,
    authReady,
    roleLoading,
    roleError,
    signUp,
    signIn,
    signOut,
    isAdmin,
    refreshSession,
    retryRoleFetch,
  }), [user, session, role, loading, authReady, roleLoading, roleError, signUp, signIn, signOut, isAdmin, refreshSession, retryRoleFetch]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};