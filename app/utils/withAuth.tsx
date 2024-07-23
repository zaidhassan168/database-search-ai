import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WithAuth(props: P) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        console.log("Current user", currentUser);
        if (currentUser) {
          setUser(currentUser);
          setIsLoading(false);
        } else {
          console.log("User not logged in");
          router.push('/auth/login');
        }
      });

      return () => unsubscribe();
    }, [router]);

    if (isLoading) {
      return <div>Loading...</div>; // Or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };
}