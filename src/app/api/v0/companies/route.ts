import { sql } from '@vercel/postgres';
import {
  Employee,
  Company
} from '@/app/lib/definitions';
import { NextResponse } from 'next/server';


export async function fetchCompanies(): Promise<Company[]> {
  try {
    const data = await sql<Company>`SELECT * FROM companies`;
    return data.rows;
  } catch (error) {
    console.log('Database Error:', error);
    console.log(error);
    throw new Error('Failed to fetch companies data.');
  }
}

export async function createCompany(company: Company): Promise<Company> {
  try {
    const data = await sql<Company>`INSERT INTO companies (name) VALUES (${company.name}) RETURNING *`;
    return data.rows[0];
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to create company.');
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    const companies = await fetchCompanies();
    return NextResponse.json(companies);
  } catch (error) {
    console.log('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch companies.' }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const data = await req.json();
    const company = await createCompany(data);
    return NextResponse.json(company);
  } catch (error) {
    console.log('Database Error:', error);
    return NextResponse.json({ error: 'Failed to create company.' }, { status: 500 });
  }
}

