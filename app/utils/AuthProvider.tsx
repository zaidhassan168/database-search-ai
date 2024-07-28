import { createContext, useContext, useEffect, useState } from 'react';
import {  onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
const authContext = createContext<{ user: any | null; }>({ user: null });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs only once when the provider mounts

  return (
    <authContext.Provider value={{ user }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(authContext);
};