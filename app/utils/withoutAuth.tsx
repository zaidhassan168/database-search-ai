import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export function withoutAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WithoutAuth(props: P) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        console.log("Current user", currentUser);
        if (currentUser) {
          console.log("User is logged in, redirecting to examples");
          router.push('/examples');
        } else {
          setIsLoading(false);
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