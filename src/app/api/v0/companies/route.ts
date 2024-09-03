import { sql } from '@vercel/postgres';
import {
  Employee,
  Company
} from '@/app/lib/definitions';
import { NextResponse } from 'next/server';
import { createCompany, fetchCompanies } from '@/app/lib/data/companies';

export async function GET(): Promise<NextResponse> {
  try {
    const companies = await fetchCompanies();
    return NextResponse.json(companies);
  } catch (error) {
    console.log('Endpoint error get companies:', error);
    return NextResponse.json({ error: 'Failed to fetch companies.' }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const data = await req.json();
    const company = await createCompany(data);
    return NextResponse.json(company);
  } catch (error) {
    console.log('Endpoint error creating company:', error);
    return NextResponse.json({ error: 'Failed to create company.' }, { status: 500 });
  }
}

