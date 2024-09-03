import { NextResponse } from 'next/server';
import { updateEmployee } from '@/app/lib/data/employees';


export async function PUT(request: Request, context: any): Promise<NextResponse> {
    const employeeId = context.params;
    const employeeData = await request.json();
    try {
        const employee = await updateEmployee(employeeId, employeeData);
        return NextResponse.json(employee);
    } catch (error) {
        console.log('Endpoint error updating a employee:', error);
        return NextResponse.json({ error: 'Failed to create employee.' }, { status: 500 });
    }
}