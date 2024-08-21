import { Employee, Company } from './definitions';

const employees: Employee[] = [
    {
        id: 1,
        name: "Employee 1",
        dni: "12345678A",
        nss: "123456789012",
        companyId: 1
    },
    {
        id: 2,
        name: "Employee 2",
        dni: "87654321B",
        nss: "987654321012",
        companyId: 2
    },
    {
        id: 3,
        name: "Employee 3",
        dni: "11111111C",
        nss: "111111111012",
        companyId: 3
    },
    {
        id: 4,
        name: "Employee 4",
        dni: "22222222D",
        nss: "222222222012",
        companyId: 4
    }
];

const companies: Company[] = [
    {
        id: 1,
        name: "Company 1",
        cif: "12345678A",
        address: "Calle Falsa 123",
        cp: "12345",
        city: "Springfield"
    },
    {
        id: 2,
        name: "Company 2",
        cif: "87654321B",
        address: "Calle Falsa 456",
        cp: "54321",
        city: "Shelbyville"
    },
    {
        id: 3,
        name: "Company 3",
        cif: "11111111C",
        address: "Calle Falsa 789",
        cp: "67890",
        city: "Ogdenville"
    },
    {
        id: 4,
        name: "Company 4",
        cif: "22222222D",
        address: "Calle Falsa 1011",
        cp: "11213",
        city: "North Haverbrook"
    }
];

export { employees, companies };

