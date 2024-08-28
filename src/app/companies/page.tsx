import Link from "next/link";
import { Company } from "@/app/lib/definitions";
import { createCompany, deleteCompany, fetchCompanies, updateCompany } from "@/app/lib/data/companies";
import { MainTitle } from "@/app/ui/titles";
import { LogoutButton } from "@/app/ui/buttons";
import CompanyModal from "@/app/ui/companyModal";

type SearchParamProps = {
    searchParams: Record<string, string> | null | undefined;
};

const handleCreateCompany = async (company : Company) => {
    "use server";
    try {
        console.log("Creating company", company);
        // create company
        await createCompany(company);

    } catch (error) {
        console.log("Error creating company", error);
    }
};
const handleModifyCompany = async (company : Company) => {
    "use server";
    try {
        console.log("Updating company", company);
        // Update company
        await updateCompany(company.id, company);

    } catch (error) {
        console.log("Error updating company", error);
    }
};
const handleDeleteCompany = async (company : Company) => {
    "use server";
    try {
        console.log("Deleting company", company);
        // Update company
        await deleteCompany(company.id);

    } catch (error) {
        console.log("Error deleting company", error);
    }
};

export default async function CompaniesPage({ searchParams }: SearchParamProps) {
    const companies: Company[] = await fetchCompanies();
    const showModal = searchParams?.show;
    const editModal = searchParams?.edit;
    const deleteModal = searchParams?.delete;
    const baseURL = `/companies`;
    return (
        <section className="flex flex-col items-center justify-center h-screen flex-grow">
            <LogoutButton> Cerrar sesión </LogoutButton>
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
                                <Link href={`/companies?edit=${company.id}`} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded" >Editar</Link>
                                {/* Create delete button to delete a company knowing that we are in a server side rendering*/}
                                <Link href={`/companies/?delete=${company.id}`} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded">Eliminar</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className='w-full flex justify-end max-w-[60vw] mb-auto'>
                <Link href={"/companies?show=true"} className="bg-blue-500 text-white p-2 rounded mt-4">Nueva empresa</Link>
            </div>
            {showModal && <CompanyModal title="Crear empresa" baseURL={baseURL} handleSubmitCompany={handleCreateCompany} />}
            {editModal && <CompanyModal title="Editar empresa" baseURL={baseURL} handleSubmitCompany={handleModifyCompany} initialCompany={
                companies.find((company) => company.id === parseInt(editModal))
            }/>}
            {deleteModal && <CompanyModal title="Eliminar empresa" baseURL={baseURL} handleSubmitCompany={handleDeleteCompany} initialCompany={
                companies.find((company) => company.id === parseInt(deleteModal))
            } deleteCompany={true}/>}

        </section>

    );
}