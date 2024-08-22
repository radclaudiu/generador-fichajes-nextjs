import { sql } from '@vercel/postgres';
import {
  Company
} from '@/app/lib/definitions';
import { NextResponse } from 'next/server';

export async function fetchCompany(companyId: number): Promise<Company | null> {
  try {
    const data = await sql<Company>`SELECT * FROM companies WHERE id = ${companyId}`;
    if (data.rowCount === 0) {
      return null;
    }
    return data.rows[0];
  } catch (error) {
    console.log('Database Error:', error);
    console.log(error);
    throw new Error('Failed to fetch company data.');
  }
}

export async function updateCompany(companyId: number, company: Company): Promise<Company> {
  try {
    const data = await sql<Company>`UPDATE companies SET name = ${company.name}, cif = ${company.cif},address = ${company.address},cp = ${company.cp},city = ${company.city} WHERE id = ${companyId} RETURNING *`;
    return data.rows[0];
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to update company.');
  }
}

export async function deleteCompany(companyId: number): Promise<void> {
  try {
    await sql`DELETE FROM companies WHERE id = ${companyId}`;
  } catch (error) {
    console.log('Database Error:', error);
    console.log(error);
    throw new Error('Failed to delete company.');
  }
}

export async function GET(request: Request, context: any): Promise<NextResponse> {
  const { companyId } = context.params;
  try {
    const company = await fetchCompany(companyId);
    if (!company) {
      return NextResponse.json({ error: 'Company not found.' }, { status: 404 });
    }
    return NextResponse.json(company);
  } catch (error) {
    console.log('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch company.' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: any): Promise<NextResponse> {
  const { companyId } = context.params;
  const companyData = await request.json();
  try {
    const company = await updateCompany(companyId, companyData);
    return NextResponse.json(company);
  } catch (error) {
    console.log('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch company.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any): Promise<NextResponse> {
  const { companyId } = context.params;
  try {
    await deleteCompany(companyId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log('Database Error:', error);
    return NextResponse.json({ error: 'Failed to delete company.' }, { status: 500 });
  }
}