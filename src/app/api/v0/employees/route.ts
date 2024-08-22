import { sql } from '@vercel/postgres';
import {
    Employee
} from '@/app/lib/definitions';
import { NextResponse } from 'next/server';

export async function createEmployee(employee: Employee): Promise<Employee> {
    try {
        const data = await sql<Employee>`INSERT INTO employees (name, dni, nss, company_id) VALUES (${employee.name}, ${employee.dni}, ${employee.nss}, ${employee.companyId}) RETURNING *`;
        return data.rows[0];
    } catch (error) {
        console.log('Database Error:', error);
        throw new Error('Failed to create employee.');
    }
}

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