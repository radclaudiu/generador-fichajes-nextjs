import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./app/lib/auth";
import { JWTClaimValidationFailed } from 'jose/errors';



export default async function middleware(req: NextRequest) {
    const session = req.cookies.get('session')?.value;
    const baseUrl = `http://${req.headers.get('host')}`;
    console.log('domain', `popopopopopopopop -- ${req.url}`);
    
    if (req.url.includes('api') && !req.url.includes('login') && !session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!req.url.includes('login') && !req.url.includes('api') && !session) {
        return NextResponse.redirect(`${baseUrl}/login`);
    }
   
    if (req.url.includes('login') && !req.url.includes('api') && session) {
        return NextResponse.redirect(`${baseUrl}/companies`);
    }
    try {
        return await updateSession(req);
    } catch (e) {
        if (e instanceof JWTClaimValidationFailed) {
            const res = NextResponse.next();
            res.cookies.set({
                name: 'session',
                value: '',
                expires: new Date(0),
                httpOnly: true,
            });
            return NextResponse.redirect(`${baseUrl}/login`);
        }
    }
}
