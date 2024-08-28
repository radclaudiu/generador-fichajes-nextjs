import { db } from '@vercel/postgres';
import { companies, employees } from '@/app/lib/placeholder-data';

const client = await db.connect();

async function seedCompanies() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS companies (
      id SERIAL PRIMARY KEY,
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
        INSERT INTO companies (name, cif, address, cp, city)
        VALUES (${company.name}, ${company.cif}, ${company.address}, ${company.cp}, ${company.city})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCompanies;
}

async function seedEmployees() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
     CREATE TABLE IF NOT EXISTS employees (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      dni VARCHAR(25) NOT NULL UNIQUE,
      nss VARCHAR(255) NOT NULL UNIQUE,
      monday_in TIME,
      monday_out TIME,
      tuesday_in TIME,
      tuesday_out TIME,
      wednesday_in TIME,
      wednesday_out TIME,
      thursday_in TIME,
      thursday_out TIME,
      friday_in TIME,
      friday_out TIME,
      saturday_in TIME,
      saturday_out TIME,
      sunday_in TIME,
      sunday_out TIME,
      company_id INT REFERENCES companies(id) ON DELETE CASCADE
    );
  `;

  await client.sql`
     CREATE TABLE IF NOT EXISTS vacations (
      id SERIAL PRIMARY KEY,
      employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL
    );
  `;

  await client.sql`
     CREATE TABLE IF NOT EXISTS checks (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      employee_id INT REFERENCES employees(id) ON DELETE CASCADE
    );
  `;

  const insertedEmployees = await Promise.all(
    employees.map(async (employee) => {
      await client.sql`
      INSERT INTO employees (name, dni, nss, company_id)
      VALUES (${employee.name}, ${employee.dni}, ${employee.nss}, ${employee.companyId})
      ON CONFLICT (id) DO NOTHING;
      `;
      console.log("Created employee",employee);
      return employee;
    }),
  );

  return insertedEmployees;
}

export async function GET() {
  try {
    // remove all data from the tables
    await client.sql`DROP TABLE IF EXISTS vacations`;
    await client.sql`DROP TABLE IF EXISTS checks`;
    await client.sql`DROP TABLE IF EXISTS employees`;
    await client.sql`DROP TABLE IF EXISTS companies`;

    await client.sql`BEGIN`;
    await seedCompanies();
    await seedEmployees();
    await client.sql`COMMIT`;

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}