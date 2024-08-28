import { login } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
    const validContentTypes = ['application/x-www-form-urlencoded', 'multipart/form-data'];

    
    const contentType = req.headers.get('content-type')?.split(';')[0];
    if (!contentType || !validContentTypes.includes(contentType)) {
        return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    const response = await login(await req.formData())
    if (response) {
        return response;
    } 
    return NextResponse.json({ message: 'Login successful' }, { status: 200 }); 

}