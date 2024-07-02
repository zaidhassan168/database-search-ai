// pages/api/proxy.ts
// app/api/proxy/route.ts

import { NextResponse } from 'next/server';

const thirdPartyApiUrl = 'https://llm.mdb.ai/chat/completions';

export async function POST(request: Request) {
  // const apiKey = process.env.THIRD_PARTY_API_KEY;
  try {
    // Parse the incoming request body
    const requestData = await request.json();

    // Forward the request to the third-party API
    const response = await fetch(thirdPartyApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dffec46170bdcfaff7919631f3ebd99edeadd7c0f25c4a50f12a4d5d2407fc2b', // Replace with your actual API key
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}







// import type { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { method, body } = req;

//   if (method !== 'POST') {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${method} Not Allowed`);
//     return;
//   }

//   const apiUrl = 'https://llm.mdb.ai/chat/completions'; // The third-party API URL

//   const requestOptions: RequestInit = {
//     method,
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': 'Bearer dffec46170bdcfaff7919631f3ebd99edeadd7c0f25c4a50f12a4d5d2407fc2b', // Replace with your actual API key
//     },
//     body: JSON.stringify(body),
//   };

//   try {
//     const response = await fetch(apiUrl, requestOptions);
//     const data = await response.json();
//     res.status(response.status).json(data);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch data from third-party API' });
//   }
// }
