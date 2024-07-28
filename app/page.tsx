'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container,
  Typography,
  ThemeProvider, 
  createTheme 
} from '@mui/material';
import { styled } from '@mui/system';
import { useAuth } from '@/app/utils/AuthProvider';

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
  const router = useRouter();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) {
      router.push('/examples');
    } else {
      router.push('/auth/login');
    }
  }, [user, router]);

  return (
    <ThemeProvider theme={theme}>
      <StyledContainer maxWidth="md">
        <Typography variant="h5" align="center">
          Loading...
        </Typography>
      </StyledContainer>
    </ThemeProvider>
  );
};

export default Home;