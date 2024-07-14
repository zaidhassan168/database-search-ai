'use client';

import React from 'react';
import { 
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  ThemeProvider, 
  createTheme 
} from '@mui/material';
import { styled } from '@mui/system';

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
  transition: theme.transitions.create('box-shadow'),
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const Home = () => {
  const categories = {
    "Basic Chat": { url: "basic-chat" },
    "Function Calling": { url: "function-calling" },
    "File Search": { url: "file-search" },
    "All": { url: "all" },
    "Database Search": { url: "database-search" },
    "Python Function": { url: "python-function" },
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledContainer maxWidth="md">
        <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
          Explore Sample Apps Built with Assistants API
        </Typography>
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

export default Home;
