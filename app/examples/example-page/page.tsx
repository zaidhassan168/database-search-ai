import React from 'react';
import { Container, Box, TextField, Button, Typography, Link } from '@mui/material';

const LoginPage: React.FC = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
          Welcome to the AI Chatbot
        </Typography>
        <Typography component="p" variant="body2" color="textSecondary" sx={{ marginTop: 1, marginBottom: 2 }}>
          Sign in to access your personalized AI assistant.
        </Typography>
        <Box component="form" noValidate sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            variant="outlined"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            variant="outlined"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: 'primary.main',
              textTransform: 'none',
              fontWeight: 'bold',
              ':hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            Sign In
          </Button>
          <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
            <Link href="#" variant="body2" color="primary.main">
              Forgot your password?
            </Link>
            <Link href="#" variant="body2" color="primary.main">
              Sign Up
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;
