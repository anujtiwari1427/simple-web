/**
 * Supabase Client Configuration
 * If SUPABASE_URL / SUPABASE_ANON_KEY are missing, falls back safely to client-side localStorage state.
 */

export interface MockUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
}

export const isSupabaseConfigured = () => {
  return (
    typeof process !== 'undefined' &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
};

// Simple event listener for auth state across client components
type AuthListener = (user: MockUser | null) => void;
const authListeners: Set<AuthListener> = new Set();

export const subscribeToAuth = (listener: AuthListener) => {
  authListeners.add(listener);
  return () => {
    authListeners.delete(listener);
  };
};

export const notifyAuthChange = (user: MockUser | null) => {
  authListeners.forEach(listener => listener(user));
};

export const getStoredUser = (): MockUser | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('codedecoded_user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

export const setStoredUser = (user: MockUser | null) => {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('codedecoded_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('codedecoded_user');
  }
  notifyAuthChange(user);
};
