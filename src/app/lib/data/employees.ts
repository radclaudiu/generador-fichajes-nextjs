import { Check, Employee, Vacation } from "@/app/lib/definitions";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";

export async function createEmployee(employee: Employee): Promise<Employee> {
    try {
        const data = await sql<Employee>`INSERT INTO employees (name, dni, nss, monday_in, monday_out, tuesday_in, tuesday_out, wednesday_in, wednesday_out, thursday_in, thursday_out, friday_in, friday_out, saturday_in, saturday_out, sunday_in, sunday_out, company_id) VALUES (${employee.name}, ${employee.dni}, ${employee.nss}, ${employee.monday_in || null}, ${employee.monday_out || null}, ${employee.tuesday_in || null}, ${employee.tuesday_out || null}, ${employee.wednesday_in || null}, ${employee.wednesday_out || null}, ${employee.thursday_in || null}, ${employee.thursday_out || null}, ${employee.friday_in || null}, ${employee.friday_out || null}, ${employee.saturday_in || null}, ${employee.saturday_out || null}, ${employee.sunday_in || null}, ${employee.sunday_out || null}, ${employee.companyId}) RETURNING *`;
        revalidatePath(`/companies/${employee.companyId}/employees`);        
        return data.rows[0];
    } catch (error) {
        console.log('Database Error:', error);
        throw new Error('Failed to create employee.');
    }
}

export async function fetchEmployee(employeeId: number): Promise<Employee> {
    try {
        const data = await sql<Employee>`SELECT * FROM employees WHERE id = ${employeeId}`;
        data.rows[0].vacations = await fetchEmployeeVacations(employeeId);
        data.rows[0].checks = await fetchEmployeeChecks(employeeId);
        return data.rows[0];
    } catch (error) {
        console.log('Database Error:', error);
        throw new Error('Failed to fetch employee.');
    }
}

export async function fetchEmployeeVacations(employeeId: number): Promise<Vacation[]> {
    try {
        const data = await sql<Vacation>`SELECT * FROM vacations WHERE employee_id = ${employeeId}`;
        return data.rows;
    } catch (error) {
        console.log('Database Error:', error);
        throw new Error('Failed to fetch employee vacations.');
    }
}

export async function fetchEmployeeChecks(employeeId: number): Promise<Check[]> {
    try {
        const data = await sql<Check>`SELECT * FROM checks WHERE employee_id = ${employeeId}`;
        return data.rows;
    } catch (error) {
        console.log('Database Error:', error);
        throw new Error('Failed to fetch employee checks.');
    }
}

export async function updateEmployee(employeeId: number, employee: Employee): Promise<Employee> {    

    try {
        const data = await sql<Employee>`UPDATE employees SET name = ${employee.name}, dni = ${employee.dni},nss = ${employee.nss},company_id = ${employee.companyId}, monday_in = ${employee.monday_in || null}, monday_out = ${employee.monday_out || null}, tuesday_in = ${employee.tuesday_in || null}, tuesday_out = ${employee.tuesday_out || null}, wednesday_in = ${employee.wednesday_in || null}, wednesday_out = ${employee.wednesday_out || null}, thursday_in = ${employee.thursday_in || null}, thursday_out = ${employee.thursday_out || null}, friday_in = ${employee.friday_in || null}, friday_out = ${employee.friday_out || null}, saturday_in = ${employee.saturday_in || null}, saturday_out = ${employee.saturday_out || null}, sunday_in = ${employee.sunday_in || null}, sunday_out = ${employee.sunday_out || null} WHERE id = ${employeeId} RETURNING *`;
        revalidatePath(`/companies/${employee.companyId}/employees`);
        return data.rows[0];
    } catch (error) {
        console.log('Database Error:', error);
        throw new Error('Failed to update employee.');
    }
}

export async function deleteEmployee(employeeId: number): Promise<void> {
    try {
        const employee = await fetchEmployee(employeeId);
        await sql`DELETE FROM employees WHERE id = ${employeeId}`;
        revalidatePath(`/companies/${employee.companyId}/employees`);        
    } catch (error) {
        console.log('Database Error:', error);
        throw new Error('Failed to delete employee.');
    }
}

export async function createChecks(checks: Check[]): Promise<void> {
    try {
        for (const check of checks) {
            const employee = await fetchEmployee(check.employeeId);
            // insert check into database adding 1 day to the date to avoid timezone issues
            await sql`INSERT INTO checks (date, start_time, end_time, employee_id) VALUES (${new Date(check.date.getTime() + 86400000).toISOString()}, ${check.start_time.toISOString().split('T')[1]}, ${check.end_time.toISOString().split('T')[1]}, ${check.employeeId
            })`;
            revalidatePath(`/companies/${employee.companyId}/employees`);        
        }
    } catch (error) {
        console.log('Database Error:', error);
        throw new Error('Failed to create checks.');
    }
}

export async function createVacation(vacation: Vacation): Promise<Vacation> {
    try {
        const employee = await fetchEmployee(vacation.employee_id);
        const data = await sql<Vacation>`INSERT INTO vacations (start_date, end_date, employee_id) VALUES (${vacation.start_date.toISOString().split("T")[0]}, ${vacation.end_date.toISOString().split("T")[0]}, ${vacation.employee_id}) RETURNING *`;
        revalidatePath(`/companies/${employee.companyId}/employees`);        
        return data.rows[0];
    } catch (error) {
        console.log('Database Error:', error);
        throw new Error('Failed to create vacation.');
    }
}

export async function deleteVacation(vacation: Vacation): Promise<void> {
    try {
        await sql<Vacation>`SELECT * FROM vacations WHERE id = ${vacation.id}`;
        await sql`DELETE FROM vacations WHERE id = ${vacation.id}`;
        revalidatePath(`/companies/${vacation.employee_id}/employees`);        
    } catch (error) {
        console.log('Database Error:', error);
        throw new Error('Failed to delete vacation.');
    }
}
