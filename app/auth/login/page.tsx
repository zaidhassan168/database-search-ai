// Import necessary components and styles
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/./firebaseConfig';
import { Container, Typography, TextField, Button, Box, Link, Avatar, IconButton, CircularProgress, Checkbox, FormControlLabel } from '@mui/material';
import { Facebook, Twitter, Google, LockOutlined } from '@mui/icons-material';
import { withoutAuth } from '@/app/utils/withoutAuth';

// Define the LoginPage component
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle login functionality
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/examples'); // Redirect to examples after login
    } catch (err) {
      setError('Invalid email or password');
      setLoading(false);
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
        paddingLeft: '50%', // Adjust padding to position the container
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
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlined />
        </Avatar>
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
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />}
            label="Remember me"
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Link href="#" variant="body2" sx={{ display: 'block', mt: 1 }}>
            Forgot password?
          </Link>
          <Box sx={{ mt: 3, mb: 2 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={29} sx={{ color: '#000' }} /> : 'LOGIN'}
            </Button>
          </Box>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Or Sign Up Using
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <IconButton color="primary" disabled={loading}>
               <Facebook />
            </IconButton>
            <IconButton color="primary" disabled={loading}>
             <Twitter />
            </IconButton>
            <IconButton color="primary" disabled={loading}>
               <Google />
            </IconButton>
          </Box>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account?
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
