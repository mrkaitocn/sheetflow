import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const codeGsPath = path.join(process.cwd(), 'apps-script', 'Code.gs');
    const webAppHtmlPath = path.join(process.cwd(), 'apps-script', 'WebApp.html');
    
    const codeGs = fs.readFileSync(codeGsPath, 'utf8');
    const webAppHtml = fs.readFileSync(webAppHtmlPath, 'utf8');
    
    return NextResponse.json({ codeGs, webAppHtml });
  } catch (error) {
    console.error('Error reading apps script files:', error);
    return NextResponse.json({ error: 'Không thể đọc file Apps Script' }, { status: 500 });
  }
}
