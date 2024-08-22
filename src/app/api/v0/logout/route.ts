import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { logout } from '@/app/lib/auth'; // Ajusta la ruta según tu estructura


export async function GET(req: NextRequest) {
  try {
      const baseUrl = `http://${req.headers.get('host')}`;
      await logout();
      return NextResponse.redirect(`${baseUrl}/login`);
  } catch (error) {
      console.error('Failed to log out:', error);
      return NextResponse.json({ error: 'Failed to log out' }, { status: 500 });
  }
}