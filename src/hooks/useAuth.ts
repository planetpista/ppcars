import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, auth } from '../lib/supabase';
import { Database } from '../types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

export interface AuthUser extends User {
  profile?: Profile;
  phone?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { session } = await auth.getSession();
      setSession(session);
      
      if (session?.user) {
        const userWithProfile = await getUserWithProfile(session.user);
        setUser(userWithProfile);
      }
      
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          const userWithProfile = await getUserWithProfile(session.user);
          setUser(userWithProfile);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const getUserWithProfile = async (user: User): Promise<AuthUser> => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      return { 
        ...user, 
        profile: profile || undefined,
        phone: profile?.phone || undefined
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return user;
    }
  };

  const signUp = async (email: string, password: string, userData: {
    name: string;
    type: 'particulier' | 'professionnel';
    phone?: string;
    company?: string;
    address?: string;
  }) => {
    setLoading(true);
    try {
      const { data, error } = await auth.signUp(email, password, userData);
      return { data, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await auth.signIn(email, password);
      return { data, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await auth.signOut();
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (!error && data) {
        setUser({ ...user, profile: data, phone: data.phone || undefined });
      }

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const isAdmin = user?.email === 'planetpista@gmail.com';

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAuthenticated: !!session,
    isAdmin
  };
};