import { NextResponse } from 'next/server';
import { db } from '../../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export async function GET() {
  try {
    const docRef = doc(db, 'messages', 'new-chat');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return NextResponse.json({ success: true, content: docSnap.data().content }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, error: 'No chat found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching chat:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch chat' }, { status: 500 });
  }
}