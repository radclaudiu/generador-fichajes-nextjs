import { sql } from '@vercel/postgres';
import {
  Employee,
  Company
} from '@/app/lib/definitions';

export async function updateEmployee(employeeId: number, employee: Employee): Promise<Employee> {
  try {
    const data = await sql<Employee>`UPDATE employees SET name = ${employee.name}, dni = ${employee.dni},nss = ${employee.nss},company_id = ${employee.companyId} WHERE id = ${employeeId} RETURNING *`;
    return data.rows[0];
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to update employee.');
  }
}