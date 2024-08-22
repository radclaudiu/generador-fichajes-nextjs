import { Company, Employee } from "@/app/lib/definitions";
import { sql } from "@vercel/postgres";

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
export async function fetchCompanyEmployees(companyId: number): Promise<Employee[]> {
    try {
        const data = await sql<Employee>`SELECT * FROM employees WHERE company_id = ${companyId}`;
        return data.rows;
    } catch (error) {
        console.log('Database Error:', error);
        console.log(error);
        throw new Error('Failed to fetch employees data.');
    }
}
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

export async function createCompany(company: Company): Promise<Company> {
    try {
        const data = await sql<Company>`INSERT INTO companies (name, cif, address, cp, city) VALUES (${company.name}, ${company.cif}, ${company.address}, ${company.cp}, ${company.city}) RETURNING *`;
        return data.rows[0];
    } catch (error) {
        console.log('Database Error:', error);
        throw new Error('Failed to create company.');
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
