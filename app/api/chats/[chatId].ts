import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../firebaseConfig';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { chatId } = req.query;

  try {
    const chatDocRef = doc(db, 'chats', chatId as string);
    const chatDoc = await getDoc(chatDocRef);

    if (!chatDoc.exists()) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    res.status(200).json(chatDoc.data());
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { chatId } = req.query;
  console.log('Received message:', req.body);
  try {
    const { message, threadId } = req.body;
    const chatDocRef = doc(db, 'chats', chatId as string);
    
    await updateDoc(chatDocRef, {
      messages: arrayUnion(message),
      threadId,
      lastUpdated: new Date(),
      lastMessage: message.text
    });
    console.log('Message saved successfully:', message);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return GET(req, res);
  } else if (req.method === 'POST') {
    return POST(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
