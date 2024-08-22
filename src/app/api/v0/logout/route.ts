import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { logout } from '@/app/lib/auth'; // Ajusta la ruta según tu estructura


export async function GET(req: NextRequest) {
  try {
      // Elimina la cookie de sesión
      await logout();
      // Redirige al usuario a la página de inicio de sesión
      const session = req.cookies.get('session')?.value;
      const baseUrl = req.url.split('?')[0];
      const domain = req.headers.get('host');
      return NextResponse.redirect(`http://${domain}/login`);
  } catch (error) {
      console.error('Failed to log out:', error);
      return NextResponse.json({ error: 'Failed to log out' }, { status: 500 });
  }
}