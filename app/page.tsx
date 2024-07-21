'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container,
  Typography,
  ThemeProvider, 
  createTheme 
} from '@mui/material';
import { styled } from '@mui/system';
import { useAuth } from '@/app/utils/AuthProvider';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Custom Theme (Customize to your liking)
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(12),
}));

const Home = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User', user);  
        router.push('/examples');
      } else {
        console.log('User not logged in helllooo');
        router.push('/auth/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <StyledContainer maxWidth="md">
          <Typography variant="h5" align="center">
            Loading...
          </Typography>
        </StyledContainer>
      </ThemeProvider>
    );
  }

  return null; // The component doesn't render anything as it always redirects
};

export default Home;