import { NextResponse } from 'next/server';
import { createEmployee } from '@/app/lib/data/employees';

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const data = await req.json();
        const employee = await createEmployee(data);
        return NextResponse.json(employee);
    } catch (error) {
        console.log('Database Error:', error);
        return NextResponse.json({ error: 'Failed to create employee.' }, { status: 500 });
    }
}