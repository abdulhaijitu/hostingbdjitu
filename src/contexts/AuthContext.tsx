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

// ═══════════════════════════════════════════════════════════════
// PERFORMANCE OPTIMIZATION: Persistent role cache
// Role is cached in memory AND sessionStorage to survive page reloads
// This eliminates role re-fetching on navigation
// ═══════════════════════════════════════════════════════════════
const ROLE_CACHE_KEY = 'chost_role_cache';

// In-memory cache for instant access
const roleCache = new Map<string, AppRole>();

// Load cache from sessionStorage on init
const loadCachedRole = (userId: string): AppRole | null => {
  // Check memory first (fastest)
  if (roleCache.has(userId)) {
    return roleCache.get(userId)!;
  }
  
  // Check sessionStorage
  try {
    const cached = sessionStorage.getItem(ROLE_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.userId === userId && parsed.role) {
        // Populate memory cache
        roleCache.set(userId, parsed.role);
        return parsed.role;
      }
    }
  } catch {
    // Silent fail for storage errors
  }
  return null;
};

// Save role to both caches
const saveRoleCache = (userId: string, role: AppRole) => {
  roleCache.set(userId, role);
  try {
    sessionStorage.setItem(ROLE_CACHE_KEY, JSON.stringify({ userId, role }));
  } catch {
    // Silent fail for storage errors
  }
};

// Clear role cache
const clearRoleCache = (userId?: string) => {
  if (userId) {
    roleCache.delete(userId);
  } else {
    roleCache.clear();
  }
  try {
    sessionStorage.removeItem(ROLE_CACHE_KEY);
  } catch {
    // Silent fail
  }
};

// Session refresh interval (45 minutes - before 1 hour expiry)
const SESSION_REFRESH_INTERVAL = 45 * 60 * 1000;

// Auth initialization timeout
const AUTH_INIT_TIMEOUT = 5000;

// Retry configuration for role fetch via edge function
const ROLE_FETCH_MAX_RETRIES = 3;
const ROLE_FETCH_BASE_DELAY = 1000; // 1 second base delay

// Edge function URL for role resolution
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const GET_USER_ROLE_URL = `${SUPABASE_URL}/functions/v1/get-user-role`;

// Helper: delay with exponential backoff
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const getBackoffDelay = (attempt: number) => ROLE_FETCH_BASE_DELAY * Math.pow(2, attempt);

interface RoleResponse {
  role: 'admin' | 'customer' | null;
  error?: string;
  userId?: string;
}

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

  // Derived state from roleState
  const role = roleState.status === 'resolved' ? roleState.role : null;
  const roleLoading = roleState.status === 'loading';
  const roleError = roleState.status === 'error' ? roleState.error : null;
  const isAdmin = role === 'admin';

  // Fetch role via secure edge function with exponential backoff
  // PERFORMANCE: Uses persistent cache to eliminate re-fetches on navigation
  const fetchUserRole = useCallback(async (accessToken: string, userId: string, forceRefresh = false): Promise<AppRole | null> => {
    // Check persistent cache first (unless force refresh)
    // This makes role resolution instant on navigation
    if (!forceRefresh) {
      const cachedRole = loadCachedRole(userId);
      if (cachedRole) {
        if (mountedRef.current) {
          setRoleState({ status: 'resolved', role: cachedRole });
        }
        console.log(`[Auth] Role loaded from cache: ${cachedRole}`);
        return cachedRole;
      }
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
        console.log(`Role fetch attempt ${attempt + 1}/${ROLE_FETCH_MAX_RETRIES + 1} via edge function...`);
        
        const response = await fetch(GET_USER_ROLE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!mountedRef.current) {
          currentFetchRef.current = null;
          return null;
        }

        const data: RoleResponse = await response.json();

        // Edge function returns 200 even on errors - check for role
        if (data.role) {
          const userRole: AppRole = data.role;
          
          // Cache the result in both memory and sessionStorage
          saveRoleCache(userId, userRole);
          setRoleState({ status: 'resolved', role: userRole });
          currentFetchRef.current = null;
          
          if (attempt > 0) {
            console.log(`[Auth] Role fetch succeeded on attempt ${attempt + 1}: ${userRole}`);
          } else {
            console.log(`[Auth] Role resolved: ${userRole}`);
          }
          
          return userRole;
        }

        // Role is null - could be error or no role found
        if (data.error) {
          lastError = data.error;
          console.warn(`Role fetch attempt ${attempt + 1}/${ROLE_FETCH_MAX_RETRIES + 1} returned error:`, data.error);
          
          // If not the last attempt, wait and retry
          if (attempt < ROLE_FETCH_MAX_RETRIES) {
            const backoffDelay = getBackoffDelay(attempt);
            console.log(`Retrying in ${backoffDelay}ms...`);
            await delay(backoffDelay);
            continue;
          }
        } else {
          // No role found, default to customer
          const defaultRole: AppRole = 'customer';
          saveRoleCache(userId, defaultRole);
          setRoleState({ status: 'resolved', role: defaultRole });
          currentFetchRef.current = null;
          console.log('[Auth] No role found, defaulting to customer');
          return defaultRole;
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Network error';
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

    // All retries exhausted - show error state with retry option
    // CRITICAL: DO NOT deny access here - show retry UI instead
    console.error('Role fetch failed after all retries');
    if (mountedRef.current) {
      setRoleState({ 
        status: 'error', 
        error: lastError || 'রোল লোড করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।'
      });
    }
    currentFetchRef.current = null;
    return null;
  }, [roleState.status]);

  // Retry role fetch function (manual retry)
  const retryRoleFetch = useCallback(async () => {
    if (!user?.id || !session?.access_token) return;
    
    // Clear cache for this user
    clearRoleCache(user.id);
    currentFetchRef.current = null;
    
    await fetchUserRole(session.access_token, user.id, true);
  }, [user?.id, session?.access_token, fetchUserRole]);

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

    if (newSession?.user && newSession.access_token) {
      // Fetch role via secure edge function
      await fetchUserRole(newSession.access_token, newSession.user.id);
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

        if (existingSession?.user && existingSession.access_token) {
          setSession(existingSession);
          setUser(existingSession.user);
          
          // Fetch role via secure edge function
          await fetchUserRole(existingSession.access_token, existingSession.user.id);
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
    // Clear all role caches on sign out
    clearRoleCache(user?.id);
    
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