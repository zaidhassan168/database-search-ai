'use client';

import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  ThemeProvider, 
  createTheme 
} from '@mui/material';
import { styled } from '@mui/system';
import { useAuth } from '@/app/utils/AuthProvider';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import {auth} from '@/firebaseConfig';
import { sign } from 'crypto';
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

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const ExamplesPage = () => {
  // const { user, logout } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   const auth = getAuth();
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       console.log('User', user);  
  //       router.push('/examples');
  //     } else {
  //       console.log('User not logged in');
  //       router.push('/auth/login');
  //     }
  //     // setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, [router, user]);

  const handleLogout = async () => {
    console.log("Logging" ,auth);
    await signOut(auth);
    router.push('/auth/login'); // Redirect to login page after logout
  };

  const categories = {
    "Basic Chat": { url: "basic-chat" },
    "Function Calling": { url: "function-calling" },
    "File Search": { url: "file-search" },
    "All": { url: "all" },
    "Database Search": { url: "database-search" },
    "Python Function": { url: "python-function" },
    "Example Page": { url: "example-page" },
    "Main Chat": { url: "main-chat" },
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledContainer maxWidth="md">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Explore Sample Apps Built with Assistants API
          </Typography>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        <Grid container spacing={4}>
          {Object.entries(categories).map(([name, { url }]) => (
            <Grid item key={name} xs={12} sm={6} md={4}>
              <StyledCard>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Click to explore the {name.toLowerCase()} example.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" href={`/examples/${url}`}>
                    Explore
                  </Button>
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </StyledContainer>
    </ThemeProvider>
  );
};

export default ExamplesPage;
