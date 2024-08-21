import { sql } from '@vercel/postgres';
import {
  Employee,
  Company
} from './definitions';

export async function fetchEmployees(companyName: string): Promise<Employee[]> {
  try {
    const data = await sql<Employee>`SELECT * FROM employees`;
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