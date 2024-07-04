import { exec } from 'child_process';
import { promisify } from 'util';
import { NextResponse } from 'next/server';
import path from 'path';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // Use path.join to create a platform-independent path to your script
    const scriptPath = path.join(process.cwd(), 'scripts', 'your_script.py');
    
    // Run the Python script
    const { stdout, stderr } = await execAsync(`python "${scriptPath}"`);
    
    if (stderr) {
      console.error('stderr:', stderr);
      return NextResponse.json({ error: stderr }, { status: 500 });
    } else {
      // Parse the output if it's JSON
      const result = JSON.parse(stdout);
      return NextResponse.json({ result });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}