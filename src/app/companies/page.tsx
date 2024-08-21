import Link from "next/link";
import { Company } from "../lib/definitions";

export default function CompaniesPage() {
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
    // Create page with a list of cards to show companies with 4 buttons to edit, delete, view and create a new company
    return (
        <section className="flex flex-col items-center justify-center h-screen flex-grow">
            <h1 className="mb-3">Empresas</h1>
            <div className="grid grid-cols-3 gap-4">
                {companies.map((company) => (
                    <div key={company.name} className="bg-white p-4 rounded shadow">
                        <h2 className="text-black font-bold">{company.name}</h2>
                        <p>CIF: {company.cif}</p>
                        <p>Dirección: {company.address}</p>
                        <p>CP: {company.cp}</p>
                        <p>Ciudad: {company.city}</p>
                        <div className="flex align-bottom mt-4 gap-2 flex-wrap min-w-36 max-w-96">
                            <Link className="bg-green-500 hover:bg-green-600 text-white p-2 rounded" href={`/companies/${company.id}/employees`}>Ver Empleados</Link>
                            <Link className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded" href={"/"}>Editar</Link>
                            <Link className="bg-red-500 hover:bg-red-600 text-white p-2 rounded" href={"/"}>Eliminar</Link>
                        </div>
                    </div>
                ))}
            </div>
            <button className="bg-blue-500 text-white p-2 rounded mt-4">New Company</button>
        </section>

    );
}