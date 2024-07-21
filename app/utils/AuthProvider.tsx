import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        console.log('AuthProvider: Auth state changed', user ? 'User logged in' : 'User logged out');
        setUser(user);
        setLoading(false);
      },
      (error) => {
        console.error('AuthProvider: Error in auth state change', error);
        setLoading(false);
      }
    );

    // Attempt to get the current user immediately
    const currentUser = auth.currentUser;
    console.log('AuthProvider: Immediate current user check:', currentUser ? 'User found' : 'No user found');

    return () => {
      console.log('AuthProvider: Unsubscribing from auth state listener');
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('AuthProvider: User logged out successfully');
    } catch (error) {
      console.error('AuthProvider: Logout error:', error);
    }
  };

  useEffect(() => {
    console.log('AuthProvider: User state updated', user ? 'User set' : 'User null');
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};