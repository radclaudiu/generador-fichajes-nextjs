import { NextResponse } from 'next/server';
import { fetchCompanyEmployees } from '@/app/lib/data/companies';

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