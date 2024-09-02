import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./app/lib/auth";
import { JWTClaimValidationFailed } from 'jose/errors';

export default async function middleware(req: NextRequest) {
    const session = req.cookies.get('checks-generator-session')?.value;
    const baseUrl = `http://${req.headers.get('host')}`;
    
    // Rutas permitidas sin autenticación
    const isLoginRoute = req.url.includes('/login');
    
    // Si no hay sesión y no es la ruta de login, redirigir o rechazar
    if (!session) {
        if (isLoginRoute) {
            // Si está intentando acceder a /login, permitir la petición
            return NextResponse.next();
        } else if (req.url.includes('/api')) {
            // Si es una ruta de API y no hay sesión, responder con 401
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        } else {
            // Si es cualquier otra ruta, redirigir a /login
            return NextResponse.redirect(`${baseUrl}/login`);
        }
    }

    // Si hay sesión y está intentando acceder a /login, redirigir a /companies
    if (isLoginRoute) {
        return NextResponse.redirect(`${baseUrl}/companies`);
    }

    // Si hay sesión, intentar actualizar la sesión
    try {
        return await updateSession(req);
    } catch (e) {
        if (e instanceof JWTClaimValidationFailed) {
            const res = NextResponse.next();
            res.cookies.set({
                name: 'checks-generator-session',
                value: '',
                expires: new Date(0),
                httpOnly: true,
            });
            return NextResponse.redirect(`${baseUrl}/login`);
        }
    }

    // Si no hubo ningún problema, permitir la continuación de la petición
    return NextResponse.next();
}
