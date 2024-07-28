
// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: 'dffec46170bdcfaff7919631f3ebd99edeadd7c0f25c4a50f12a4d5d2407fc2b',
//   baseURL: 'https://llm.mdb.ai'
// });

// export async function POST(request: Request) {
//   try {
//     // Parse the incoming request body
//     const requestData = await request.json();

//     // Create a chat completion using the SDK-like structure
//     const completion = await openai.chat.completions.create({
//       messages: requestData.messages,
//       model: requestData.model || 'gpt-3.5-turbo',
//       stream:false,
//     });
//     console.log(completion.choices);
//     // const completion = await openai.chat.completions.create({
//     //   messages: requestData.messages,
//     //   model: "driver_mind",
//     //   stream: false,
//     // });
//     // console.log(completion);
//     // return NextResponse.json(completion);
//     //return toreadablestream
//     // if stream: true, then print chunks, as below
//     // for await (const chunk of completion) {
//     //   console.log(chunk.choices[0].delta.content);
//     //   return new Response(completion.toReadableStream());
//     // }
//     // return new Response(completion.toReadableStream());
//    // return new Response(completion.data.choices[0].text);
//    const data = await completion;
//    return NextResponse.json(data.choices[0].message.content);
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';

const thirdPartyApiUrl = 'https://llm.mdb.ai/chat/completions';
export const maxDuration = 60; // This function can run for a maximum of 5 seconds

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
    console.log(response);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data.choices[0].message.content);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}





