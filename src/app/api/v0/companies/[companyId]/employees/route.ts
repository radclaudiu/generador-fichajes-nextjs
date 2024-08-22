import { sql } from '@vercel/postgres';
import {
    Employee
} from '@/app/lib/definitions';
import { NextResponse } from 'next/server';

export async function fetchCompanyEmployees(companyId: number): Promise<Employee[]> {
    try {
        const data = await sql<Employee>`SELECT * FROM employees WHERE company_id = ${companyId}`;
        return data.rows;
    } catch (error) {
        console.log('Database Error:', error);
        console.log(error);
        throw new Error('Failed to fetch employees data.');
    }
}

export async function GET(request: Request, context: any): Promise<NextResponse> {
    const { companyId } = context.params;
    try {
        const employees = await fetchCompanyEmployees(companyId);        
        return NextResponse.json(employees);
    } catch (error) {
        console.log('Database Error:', error);
        return NextResponse.json({ error: 'Failed to fetch employees.' }, { status: 500 });
    }
}