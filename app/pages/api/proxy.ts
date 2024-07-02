// pages/api/proxy.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
    return;
  }

  const apiUrl = 'https://llm.mdb.ai/chat/completions'; // The third-party API URL

  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer dffec46170bdcfaff7919631f3ebd99edeadd7c0f25c4a50f12a4d5d2407fc2b', // Replace with your actual API key
    },
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(apiUrl, requestOptions);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from third-party API' });
  }
}
