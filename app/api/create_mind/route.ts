import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(req: NextRequest) {
  const { name, description } = await req.json();

  const scriptPath = path.join(process.cwd(), 'app/api/create_mind', 'create_mind.py');
  const pythonProcess = spawn('python3', [scriptPath, '--name', name, '--description', description]);

  let result = '';
  let errorOccurred = false;

  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    errorOccurred = true;
  });

  return new Promise((resolve) => {
    pythonProcess.on('close', (code) => {
      if (code === 0 && !errorOccurred) {
        resolve(NextResponse.json({ result: JSON.parse(result) }, { status: 200 }));
      } else {
        resolve(NextResponse.json({ error: 'Python script execution failed' }, { status: 500 }));
      }
    });
  });
}

export async function GET() {
  return NextResponse.json({ error: `Method GET Not Allowed` }, { status: 405 });
}
