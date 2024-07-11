import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description } = body;

  if (!name || !description) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  const scriptPath = './scripts/create_mind.py';
  const command = `python3 "${scriptPath}" --name "${name}" --description "${description}"`;

  try {
    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.error('stderr:', stderr);

      // Check for the specific error related to the mind already existing
      if (stderr.includes('Agent with name')) {
        const errorMessage = stderr.split('detail": "')[1].split('"}')[0];
        return NextResponse.json({ error: errorMessage }, { status: 409 }); // Conflict
      }

      return NextResponse.json({ error: stderr }, { status: 500 });
    }

    const result = JSON.parse(stdout);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error executing Python script:', error);
    return NextResponse.json({ error: 'An error occurred while executing the Python script' }, { status: 500 });
  }
}
