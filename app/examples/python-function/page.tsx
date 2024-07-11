'use client';

import { useState } from 'react';
import { Button, TextField, Alert, AlertTitle } from '@mui/material';

interface PythonResult {
  message: string;
  random_number: number;
  custom_data: any;  // Replace 'any' with a more specific type if possible
}

export default function pythonFunction () {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [result, setResult] = useState<PythonResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const runPythonScript = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/python/create-mind', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description })
      });
  
      console.log('Response:', response);
      const data = await response.json();
      console.log('Data:', data);
  
      if (response.ok) {
        setResult(data.result as PythonResult);
      } else {
        // Handle different error scenarios based on the response status
        switch (response.status) {
          case 400:
            setError('Bad request. Please check your input data.');
            break;
          case 401:
          case 403:
            setError('You are not authorized to perform this action.');
            break;
          case 404:
            setError('The requested resource was not found.');
            break;
          case 500:
            setError('An internal server error occurred.');
            break;
          default:
            setError(data.error || 'An unknown error occurred.');
        }
      }
    } catch (err) {
      console.log('Error:', err);
      console.error('Error:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Python Script Runner</h1>
      <TextField
        label="Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        variant="outlined"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button onClick={runPythonScript} disabled={isLoading || !name || !description}>
        {isLoading ? 'Running...' : 'Run Python Script'}
      </Button>
      {result && (
        <Alert severity="success" className="mt-4">
          <AlertTitle>Result</AlertTitle>
          <textarea className="w-full" readOnly value={JSON.stringify(result, null, 2)} />
        </Alert>
      )}
      {error && (
        <Alert severity="error" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
    </div>
  );
}
