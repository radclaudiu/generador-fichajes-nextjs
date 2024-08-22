import { Employee } from "@/app/lib/definitions";
import { sql } from "@vercel/postgres";

export async function createEmployee(employee: Employee): Promise<Employee> {
    try {
        const data = await sql<Employee>`INSERT INTO employees (name, dni, nss, company_id) VALUES (${employee.name}, ${employee.dni}, ${employee.nss}, ${employee.companyId}) RETURNING *`;
        return data.rows[0];
    } catch (error) {
        console.log('Database Error:', error);
        throw new Error('Failed to create employee.');
    }
}
export async function updateEmployee(employeeId: number, employee: Employee): Promise<Employee> {
    try {
        const data = await sql<Employee>`UPDATE employees SET name = ${employee.name}, dni = ${employee.dni},nss = ${employee.nss},company_id = ${employee.companyId} WHERE id = ${employeeId} RETURNING *`;
        return data.rows[0];
    } catch (error) {
        console.log('Database Error:', error);
        throw new Error('Failed to update employee.');
    }
}