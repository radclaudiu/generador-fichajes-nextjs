import Link from 'next/link';
import React from 'react';
import { Employee } from '@/app/lib/definitions';
import { fetchCompany, fetchCompanyEmployees } from '@/app/lib/data/companies';
import { MainTitle } from '@/app/ui/titles';

export default async function EmployeesPage({ params }: { params: { companyId: number } }) {
  const company = await fetchCompany(params.companyId);
  if (!company) {
    return <div>Empresa no encontrada</div>;
  }
  const employees: Employee[] = await fetchCompanyEmployees(company.id);
  return (
    <section className="flex flex-col items-center align-middle justify-center h-screen flex-grow mx-7">
      <Link className='bg-blue-500 hover:bg-blue-600 text-white m-5 p-2 rounded ' href="/companies">Volver a empresas</Link>
      <MainTitle>Empleados de {company.name}</MainTitle>
      <div className="grid auto-rows-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 rows justify-evenly gap-4 max-h-[60vh] max-w-[60vw] w-full overflow-y-scroll mt-auto flex-grow">
        {employees.map((employee) => (
          <div key={employee.name}>
            <div className="bg-white p-4 rounded shadow">
              <h2 className='text-black font-bold'>{employee.name}</h2>
              <p>DNI: {employee.dni}</p>
              <p>NSS: {employee.nss}</p>
              <div className="flex align-bottom mt-4 gap-2 flex-wrap min-w-36 max-w-96">
                <Link className="bg-green-500 hover:bg-green-600 text-white p-2 rounded" href={`/companies/${employee.id}/employees`}>EDITAR HORARIO</Link>
                <Link className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded" href={"/"}>AGREGAR VACACIONES</Link>
                <Link className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded" href={"/"}>VER VACACIONES</Link>
                <Link className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded" href={"/"}>GENERAR FICHAJES</Link>
                <Link className="bg-red-500 hover:bg-red-600 text-white p-2 rounded" href={"/"}>ELIMINAR EMPLEADO</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='w-full flex justify-end max-w-[60vw] mb-auto'>
        <button className="bg-blue-500 text-white p-2 rounded mt-4">Nuevo empleado</button>
      </div>
    </section>
  );
};
