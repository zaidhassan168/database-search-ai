// app/api/chats/route.ts

import { NextResponse } from 'next/server';
import { db } from '../../../firebaseConfig';
import { collection, addDoc, DocumentReference, setDoc, doc } from 'firebase/firestore';

interface Message {
  content: string;
  timestamp: number;
}

export async function POST(request: Request) {
  try {
    const { message }: { message: Message } = await request.json();

    // Add the message to the "messages" collection in Firestore
    const customDocId = 'new-chat'; // Your custom document ID
    const docRef = doc(db, 'messages', customDocId);
    await setDoc(docRef, message);
    console.log('Message saved successfully:', docRef.id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}
