/* eslint-disable react-refresh/only-export-components */
import { useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import type { User } from '@supabase/supabase-js';
import { ADMIN_EMAIL, ADMIN_LOCAL_PASSWORD, isSupabaseConfigured, supabase, verifyFiftyStoreDatabase } from '../lib/supabase';
import { createStableContext } from './stableContext';

export type UserRole = 'admin' | 'client';

type AuthProviderType = 'supabase' | 'local';

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  provider: AuthProviderType;
}

interface LocalStoredUser {
  id: string;
  email: string;
  fullName: string;
  password: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isClient: boolean;
  usingSupabase: boolean;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signUpWithEmail: (fullName: string, email: string, password: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => Promise<void>;
}

const LOCAL_USERS_KEY = 'fifty-store-auth-users-v1';
const LOCAL_SESSION_KEY = 'fifty-store-auth-session-v1';

const AuthContext = createStableContext<AuthContextType>('auth');

function getRoleByEmail(email: string): UserRole {
  return email.trim().toLowerCase() === ADMIN_EMAIL ? 'admin' : 'client';
}

function mapSupabaseUser(user: User): AuthUser {
  const email = user.email ?? '';
  const metadata = user.user_metadata as { full_name?: string; name?: string; role?: string };

  const resolvedRole = metadata?.role === 'admin' ? 'admin' : getRoleByEmail(email);
  const fullName = metadata?.full_name || metadata?.name || email.split('@')[0] || 'Utilisateur';

  return {
    id: user.id,
    email,
    fullName,
    role: resolvedRole,
    provider: 'supabase',
  };
}

function readLocalUsers(): LocalStoredUser[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    const parsed = raw ? (JSON.parse(raw) as LocalStoredUser[]) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((user) => user.email && user.password && user.id);
  } catch {
    return [];
  }
}

function writeLocalUsers(users: LocalStoredUser[]): void {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

function ensureLocalAdmin(users: LocalStoredUser[]): LocalStoredUser[] {
  const adminExists = users.some((user) => user.email.toLowerCase() === ADMIN_EMAIL);
  if (adminExists) {
    return users;
  }

  const adminUser: LocalStoredUser = {
    id: 'local-admin',
    email: ADMIN_EMAIL,
    fullName: 'Fifty Store Admin',
    password: ADMIN_LOCAL_PASSWORD,
    role: 'admin',
  };

  const nextUsers = [adminUser, ...users];
  writeLocalUsers(nextUsers);
  return nextUsers;
}

function readLocalSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(LOCAL_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed?.email || !parsed?.id || !parsed?.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeLocalSession(user: AuthUser | null): void {
  if (!user) {
    localStorage.removeItem(LOCAL_SESSION_KEY);
    return;
  }

  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseReady, setSupabaseReady] = useState(false);

  useEffect(() => {
    const supabaseClient = supabase;

    if (!isSupabaseConfigured || !supabaseClient) {
      const users = ensureLocalAdmin(readLocalUsers());
      if (users.length > 0) {
        writeLocalUsers(users);
      }

      setUser(readLocalSession());
      setLoading(false);
      return;
    }

    let mounted = true;
    let unsubscribeSupabase: () => void = () => undefined;

    const init = async () => {
      const verified = await verifyFiftyStoreDatabase();
      if (!mounted) return;

      setSupabaseReady(verified);
      if (!verified) {
        const users = ensureLocalAdmin(readLocalUsers());
        if (users.length > 0) {
          writeLocalUsers(users);
        }
        setUser(readLocalSession());
        setLoading(false);
        return;
      }

      const { data, error } = await supabaseClient.auth.getSession();
      if (!mounted) return;

      if (error) {
        setLoading(false);
        return;
      }

      if (data.session?.user) {
        setUser(mapSupabaseUser(data.session.user));
      }

      const {
        data: { subscription },
      } = supabaseClient.auth.onAuthStateChange((_event, session) => {
        if (!mounted) return;

        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        } else {
          setUser(null);
        }
      });

      unsubscribeSupabase = () => subscription.unsubscribe();
      setLoading(false);
    };

    void init();

    return () => {
      mounted = false;
      unsubscribeSupabase();
    };
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password.trim()) {
      toast.error('Email et mot de passe obligatoires.');
      return false;
    }

    if (supabaseReady && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        setUser(mapSupabaseUser(data.user));
        toast.success('Connexion reussie');
        return true;
      }

      toast.error('Connexion impossible.');
      return false;
    }

    const users = ensureLocalAdmin(readLocalUsers());
    const found = users.find(
      (storedUser) => storedUser.email.toLowerCase() === normalizedEmail && storedUser.password === password,
    );

    if (!found) {
      toast.error('Identifiants invalides.');
      return false;
    }

    const localUser: AuthUser = {
      id: found.id,
      email: found.email,
      fullName: found.fullName,
      role: found.role,
      provider: 'local',
    };

    setUser(localUser);
    writeLocalSession(localUser);
    toast.success('Connexion reussie (mode local)');
    return true;
  }, [supabaseReady]);

  const signUpWithEmail = useCallback(async (fullName: string, email: string, password: string): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedFullName = fullName.trim();

    if (!trimmedFullName || !normalizedEmail || !password.trim()) {
      toast.error('Veuillez remplir tous les champs.');
      return false;
    }

    if (password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caracteres.');
      return false;
    }

    if (supabaseReady && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: trimmedFullName,
            role: getRoleByEmail(normalizedEmail),
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user && data.session?.user) {
        setUser(mapSupabaseUser(data.user));
      }

      toast.success('Compte cree avec succes.');
      return true;
    }

    const users = ensureLocalAdmin(readLocalUsers());
    const exists = users.some((storedUser) => storedUser.email.toLowerCase() === normalizedEmail);

    if (exists) {
      toast.error('Cet email existe deja.');
      return false;
    }

    const newUser: LocalStoredUser = {
      id: `local-${Date.now()}`,
      email: normalizedEmail,
      fullName: trimmedFullName,
      password,
      role: getRoleByEmail(normalizedEmail),
    };

    const nextUsers = [newUser, ...users];
    writeLocalUsers(nextUsers);

    const sessionUser: AuthUser = {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
      provider: 'local',
    };

    setUser(sessionUser);
    writeLocalSession(sessionUser);
    toast.success('Compte cree (mode local).');
    return true;
  }, [supabaseReady]);

  const signInWithGoogle = useCallback(async (): Promise<boolean> => {
    if (!supabaseReady || !supabase) {
      toast.error('Google login necessite une base Fifty Store Supabase verifiee.');
      return false;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      toast.error(error.message);
      return false;
    }

    toast.success('Redirection Google...');
    return true;
  }, [supabaseReady]);

  const signOutUser = useCallback(async (): Promise<void> => {
    if (supabaseReady && supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        return;
      }
    }

    writeLocalSession(null);
    setUser(null);
    toast.success('Deconnecte');
  }, [supabaseReady]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      isClient: user?.role === 'client',
      usingSupabase: supabaseReady,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut: signOutUser,
    }),
    [user, loading, supabaseReady, signInWithEmail, signUpWithEmail, signInWithGoogle, signOutUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
