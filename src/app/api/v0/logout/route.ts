import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { logout } from '@/app/lib/auth'; // Ajusta la ruta según tu estructura


export async function POST(req: NextRequest) {
  try {
      await logout();
      return NextResponse.json({ message: 'Logged out' }, { status: 200 });
  } catch (error) {
      console.error('Failed to log out:', error);
      return NextResponse.json({ error: 'Failed to log out' }, { status: 500 });
  }
}