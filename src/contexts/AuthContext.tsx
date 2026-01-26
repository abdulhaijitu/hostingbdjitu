import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AppRole = 'customer' | 'admin';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  loading: boolean;
  authReady: boolean;
  roleLoading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cache for role to prevent refetching
const roleCache = new Map<string, AppRole | null>();

// Session refresh interval (45 minutes - before 1 hour expiry)
const SESSION_REFRESH_INTERVAL = 45 * 60 * 1000;

// Auth initialization timeout
const AUTH_INIT_TIMEOUT = 5000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  // CRITICAL: roleLoading starts as TRUE and only becomes false after role is resolved
  const [roleLoading, setRoleLoading] = useState(true);
  
  // Refs for cleanup and preventing race conditions
  const mountedRef = useRef(true);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);
  const roleFetchInProgressRef = useRef(false);

  const fetchUserRole = useCallback(async (userId: string): Promise<AppRole | null> => {
    // Prevent concurrent fetches
    if (roleFetchInProgressRef.current) {
      console.log('[AuthContext] Role fetch already in progress, skipping...');
      return role;
    }
    
    roleFetchInProgressRef.current = true;
    
    // Ensure roleLoading is true
    setRoleLoading(true);
    console.log('[AuthContext] Starting role fetch for user:', userId);
    
    // Check cache first
    if (roleCache.has(userId)) {
      const cachedRole = roleCache.get(userId) ?? null;
      console.log('[AuthContext] Role from cache:', cachedRole);
      setRoleLoading(false);
      roleFetchInProgressRef.current = false;
      return cachedRole;
    }

    console.log('[AuthContext] Fetching role from database...');

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (!mountedRef.current) {
        roleFetchInProgressRef.current = false;
        return null;
      }

      if (error) {
        console.error('[AuthContext] Error fetching user role:', error);
        setRoleLoading(false);
        roleFetchInProgressRef.current = false;
        return null;
      }

      const userRole = (data?.role as AppRole) || 'customer'; // Default to customer if no role found
      console.log('[AuthContext] Role fetched successfully:', userRole);
      
      // Cache the result
      roleCache.set(userId, userRole);
      setRoleLoading(false);
      roleFetchInProgressRef.current = false;
      return userRole;
    } catch (error) {
      console.error('[AuthContext] Error fetching user role:', error);
      if (mountedRef.current) {
        setRoleLoading(false);
      }
      roleFetchInProgressRef.current = false;
      return null;
    }
  }, [role]);

  // Session refresh function
  const refreshSession = useCallback(async () => {
    if (isRefreshingRef.current || !mountedRef.current) return;
    
    isRefreshingRef.current = true;
    
    try {
      const { data: { session: newSession }, error } = await supabase.auth.refreshSession();
      
      if (!mountedRef.current) return;
      
      if (error) {
        console.error('Session refresh error:', error);
        // If refresh fails, sign out
        if (error.message.includes('refresh_token_not_found') || 
            error.message.includes('Invalid Refresh Token')) {
          await supabase.auth.signOut();
          setUser(null);
          setSession(null);
          setRole(null);
          setRoleLoading(false);
        }
        return;
      }
      
      if (newSession) {
        setSession(newSession);
        setUser(newSession.user);
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
    } finally {
      isRefreshingRef.current = false;
    }
  }, []);

  // Setup session refresh interval
  const setupRefreshInterval = useCallback(() => {
    // Clear existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
    
    // Set up new interval
    refreshIntervalRef.current = setInterval(() => {
      if (session && mountedRef.current) {
        refreshSession();
      }
    }, SESSION_REFRESH_INTERVAL);
  }, [session, refreshSession]);

  // Handle auth state changes
  const handleAuthChange = useCallback(async (event: AuthChangeEvent, newSession: Session | null) => {
    if (!mountedRef.current) return;
    
    console.log('[AuthContext] Auth state changed:', event, !!newSession?.user);
    
    // Update session and user
    setSession(newSession);
    setUser(newSession?.user ?? null);

    if (newSession?.user) {
      // Keep roleLoading true until role is fetched
      setRoleLoading(true);
      
      // Fetch role
      const userRole = await fetchUserRole(newSession.user.id);
      if (mountedRef.current) {
        setRole(userRole);
        console.log('[AuthContext] Role set after auth change:', userRole);
      }
      
      // Setup refresh interval when we have a session
      setupRefreshInterval();
    } else {
      setRole(null);
      setRoleLoading(false); // No user = no role loading needed
      // Clear refresh interval when no session
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    }

    // Mark auth as ready if not already
    if (!authReady && mountedRef.current) {
      setLoading(false);
      setAuthReady(true);
    }
  }, [fetchUserRole, authReady, setupRefreshInterval]);

  useEffect(() => {
    mountedRef.current = true;

    const initializeAuth = async () => {
      console.log('[AuthContext] Initializing auth...');
      
      try {
        // Get existing session first
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (!mountedRef.current) return;

        console.log('[AuthContext] Existing session:', !!existingSession?.user);

        if (existingSession?.user) {
          setSession(existingSession);
          setUser(existingSession.user);
          
          // Keep roleLoading true until role is fetched
          setRoleLoading(true);
          
          // Fetch role
          const userRole = await fetchUserRole(existingSession.user.id);
          if (mountedRef.current) {
            setRole(userRole);
            console.log('[AuthContext] Initial role set:', userRole);
          }
          
          // Setup refresh interval
          setupRefreshInterval();
        } else {
          // No user, no role loading needed
          setRoleLoading(false);
        }
      } catch (error) {
        console.error('[AuthContext] Error initializing auth:', error);
        setRoleLoading(false);
      } finally {
        if (mountedRef.current) {
          setLoading(false);
          setAuthReady(true);
          console.log('[AuthContext] Auth ready');
        }
      }
    };

    // Set up auth state listener FIRST (as recommended by Supabase)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Then initialize auth
    initializeAuth();

    // Failsafe timeout - ensure auth resolves even if something goes wrong
    initTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current && !authReady) {
        console.log('[AuthContext] Auth timeout reached, forcing ready state');
        setLoading(false);
        setAuthReady(true);
        setRoleLoading(false);
      }
    }, AUTH_INIT_TIMEOUT);

    // Handle visibility change - refresh session when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && session && mountedRef.current) {
        // Check if session is about to expire (within 10 minutes)
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
          data: {
            full_name: fullName || '',
          },
        },
      });

      return { error: error as Error | null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    // Set roleLoading true before sign in completes
    setRoleLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error: error as Error | null };
    } catch (error) {
      setRoleLoading(false);
      return { error: error as Error };
    }
  }, []);

  const signOut = useCallback(async () => {
    // Clear role cache on sign out
    if (user?.id) {
      roleCache.delete(user.id);
    }
    
    // Clear refresh interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
    
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
    setRoleLoading(false);
  }, [user?.id]);

  const value = useMemo(() => ({
    user,
    session,
    role,
    loading,
    authReady,
    roleLoading,
    signUp,
    signIn,
    signOut,
    isAdmin: role === 'admin',
    refreshSession,
  }), [user, session, role, loading, authReady, roleLoading, signUp, signIn, signOut, refreshSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
