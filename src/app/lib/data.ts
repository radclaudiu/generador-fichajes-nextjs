import { sql } from '@vercel/postgres';
import {
  Employee,
  Company
} from './definitions';

export async function fetchEmployeesByCompany(companyId: number ): Promise<Employee[]> {
  try {
    const data = await sql<Employee>`SELECT * FROM employees WHERE company_id = ${companyId}`;
    return data.rows;
  } catch (error) {
    console.log('Database Error:', error);
    console.log(error);
    throw new Error('Failed to fetch employees data.');
  }
}

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

export async function fetchCompany(id: number): Promise<Company> {
  try {
    const data = await sql<Company>`SELECT * FROM companies WHERE id = ${id}`;
    return data.rows[0];
  } catch (error) {
    console.log('Database Error:', error);
    console.log(error);
    throw new Error('Failed to fetch company data.');
  }
}

export async function deleteCompany(id: number): Promise<void> {
  try {
    await sql`DELETE FROM companies WHERE id = ${id}`;
  } catch (error) {
    console.log('Database Error:', error);
    console.log(error);
    throw new Error('Failed to delete company.');
  }
}