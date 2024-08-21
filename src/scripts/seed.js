import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import { companies, customers, revenue, employees } from '../lib/placeholder-data';

const client = await db.connect();

async function seedEmployees() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS employees (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      dni VARCHAR(25) NOT NULL UNIQUE,
      nss VARCHAR(255) NOT NULL UNIQUE
    );
  `;

  const insertedEmployees = await Promise.all(
    employees.map(async (employee) => {
      const hashedPassword = await bcrypt.hash(employee.password, 10);
      return client.sql`
        INSERT INTO employees (id, name, dni, nss, company_id)
        VALUES (${employee.id}, ${employee.name}, ${employee.dni}, ${employee.nss}, ${employee.companyId})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedEmployees;
}

async function seedCompanies() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS companies (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      cif VARCHAR(25) NOT NULL UNIQUE,
      address VARCHAR(255) NOT NULL,
      cp VARCHAR(25) NOT NULL,
      city VARCHAR(255) NOT NULL
    );
  `;

  const insertedCompanies = await Promise.all(
    companies.map(
      (company) => client.sql`
        INSERT INTO companies (id, name, cif, address, cp, city)
        VALUES (${company.customer_id}, ${company.name}, ${company.cif}, ${company.address}, ${company.cp}, ${company.city})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCompanies;
}