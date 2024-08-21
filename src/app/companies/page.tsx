import Link from "next/link";
import { Company } from "../lib/definitions";
import { deleteCompany, fetchCompanies } from "../lib/data";
import { MainTitle } from "../ui/titles";

export default async function CompaniesPage() {
    const companies: Company[] = await fetchCompanies();

    return (
        <section className="flex flex-col items-center justify-center h-screen flex-grow">
            <button className='bg-red-500 hover:bg-red-600 text-white m-5 p-2 rounded' >Cerrar sesión</button>
            <MainTitle>Empresas</MainTitle>
            <div className="grid auto-rows-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 rows justify-evenly gap-4 max-h-[60vh] max-w-[60vw] w-full overflow-y-scroll mt-auto flex-grow">
                {companies.map((company) => (
                    <div key={company.name}>
                        <div className="bg-white p-4 rounded shadow">
                            <h2 className='text-black font-bold'>{company.name}</h2>
                            <p>CIF: {company.cif}</p>
                            <p>Dirección: {company.address}</p>
                            <p>CP: {company.cp}</p>
                            <p>Ciudad: {company.city}</p>
                            <div className="flex align-bottom mt-4 gap-2 flex-wrap min-w-36 max-w-96">
                                <Link className="bg-green-500 hover:bg-green-600 text-white p-2 rounded" href={`/companies/${company.id}/employees`}>Ver Empleados</Link>
                                <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded" >Editar</button>
                                <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded" >Eliminar</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className='w-full flex justify-end max-w-[60vw] mb-auto'>
                <button className="bg-blue-500 text-white p-2 rounded mt-4">Nueva empresa</button>
            </div>
        </section>

    );
}