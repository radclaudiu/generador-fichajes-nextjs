import { NextResponse } from 'next/server';
import { deleteCompany, fetchCompany, updateCompany } from '@/app/lib/data/companies';

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