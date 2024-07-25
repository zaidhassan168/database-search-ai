'use client';

// Import necessary components and styles
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/./firebaseConfig';
import { withoutAuth } from '@/app/utils/withoutAuth';

import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Avatar,
  IconButton,
} from '@mui/material';
import { Facebook, Twitter, Google, LockOutlined } from '@mui/icons-material';

// Define the LoginPage component
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Handle login functionality
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/examples'); // Redirect to examples after login
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundImage: 'url(/bg.jpg)', // Update this path to your image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        paddingLeft: '50%',
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Adding transparency
          borderRadius: 2,
          boxShadow: 3,
          width: '100%',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ width: '100%', mt: 2 }}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Username"
            name="email"
            autoComplete="username"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                  <LockOutlined />
                </Avatar>
              ),
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                  <LockOutlined />
                </Avatar>
              ),
            }}
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Link href="#" variant="body2" sx={{ display: 'block', mt: 1 }}>
            Forgot password?
          </Link>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
            }}
          >
            LOGIN
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Or Sign Up Using
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <IconButton color="primary">
              <Facebook />
            </IconButton>
            <IconButton color="primary">
              <Twitter />
            </IconButton>
            <IconButton color="primary">
              <Google />
            </IconButton>
          </Box>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Or Sign Up Using
          </Typography>
          <Link href="/auth/signup" variant="body2" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
            SIGN UP
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default withoutAuth(LoginPage);
