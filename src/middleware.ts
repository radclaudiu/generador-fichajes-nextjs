import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./app/lib/auth";
import { JWTClaimValidationFailed } from 'jose/errors';
import { log } from "console";
import { Odor_Mean_Chey } from "next/font/google";

export default async function middleware(req: NextRequest) {
    const session = req.cookies.get('session')?.value;
    const baseUrl = req.url.split('?')[0];
    const domain = req.headers.get('host');
    
    if (!req.url.includes('login') && !session) {
        return NextResponse.redirect(`http://${domain}/login`);
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
            return NextResponse.redirect(`http://${domain}/login`);
        }
    }
}
