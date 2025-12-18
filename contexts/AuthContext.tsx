
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { supabasePromise } from '../supabaseClient';
import { SupabaseSession, UserTier } from '../types';

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  tier: UserTier;
  isAdmin: boolean;
  userEmail?: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [loading, setLoading] = useState(true);
  
  const isLoggedIn = !!session;
  // Extrai o tier dos metadados ou define como 'free' por padrão
  const tier: UserTier = session?.user?.user_metadata?.tier || 'free';
  const isAdmin = tier === 'admin';
  const userEmail = session?.user?.email;

  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        const supabase = await supabasePromise;
        if (!isMounted) return;

        // 1. Obtém a sessão atual
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (isMounted) {
          if (error) {
            console.error("Erro ao verificar sessão:", error);
          }
          setSession(session as SupabaseSession | null);
        }

        // 2. Configura o listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event: string, session: SupabaseSession | null) => {
            if (isMounted) {
              setSession(session as SupabaseSession | null);
              setLoading(false);
            }
          }
        );

        return () => {
          isMounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Erro crítico na autenticação:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const supabase = await supabasePromise;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error(error.message);
    }
  }, []);

  const logout = useCallback(async () => {
    const supabase = await supabasePromise;
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Erro ao fazer logout:', error);
    } else {
      setSession(null);
    }
  }, []);

  const value = useMemo(() => ({ 
    isLoggedIn, 
    isLoading: loading, 
    tier, 
    isAdmin,
    userEmail,
    login, 
    logout 
  }), [isLoggedIn, loading, tier, isAdmin, userEmail, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
