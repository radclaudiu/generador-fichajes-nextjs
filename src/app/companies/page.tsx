import Link from "next/link";
import { Company } from "../lib/definitions";
import { fetchCompanies } from "../lib/data";

export default async function CompaniesPage() {
    const companies: Company[] = await fetchCompanies();
    
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