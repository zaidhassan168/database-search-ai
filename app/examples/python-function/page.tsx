'use client';

import { useState } from 'react';
import { Button } from '@mui/material'
import { Alert, AlertTitle } from '@mui/material';

interface PythonResult {
  message: string;
  random_number: number;
  custom_data: any;  // Replace 'any' with a more specific type if possible
}

export default function pythonFunction () {
  const [result, setResult] = useState<PythonResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const runPythonScript = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/python');
      console.log('Response:', response);
      const data = await response.json();
      if (response.ok) {
        setResult(data.result as PythonResult);
      } else {
        throw new Error(data.error || 'An error occurred');
      }
    } catch (err) {
      console.error('Error:', err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Python Script Runner</h1>
      <Button onClick={runPythonScript} disabled={isLoading}>
        {isLoading ? 'Running...' : 'Run Python Script'}
      </Button>
      {result && (
        <Alert className="mt-4">
          <AlertTitle>Result</AlertTitle>
          <textarea className="w-full" readOnly value={JSON.stringify(result, null, 2)} />
            {/* <pre>{JSON.stringify(result, null, 2)}</pre>
            </textarea> */}
        </Alert>
      )}
      {error && (
        <Alert  className="mt-4">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
    </div>
  );
}