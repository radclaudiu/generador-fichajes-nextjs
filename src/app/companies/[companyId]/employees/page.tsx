import Link from 'next/link';
import React from 'react';

// Types and Definitions
import { Employee, Vacation } from '@/app/lib/definitions';

// Data Fetching Functions
import { fetchCompany, fetchCompanyByEmployee, fetchCompanyEmployees } from '@/app/lib/data/companies';
import { createEmployee, createVacation, deleteEmployee, deleteVacation, fetchEmployee, updateEmployee } from '@/app/lib/data/employees';

// UI Components
import { MainTitle } from '@/app/ui/titles';
import { EmployeeModal } from '@/app/ui/employeeModal';
import { ChecksModal } from '@/app/ui/checksModal';
import { DeleteVacationModal, VacationsModal } from '@/app/ui/vacationsModal';
import { DeleteButton } from '@/app/ui/buttons';
import { formatDate } from '@/app/lib/utils';

// Types for Search Parameters
type SearchParamProps = {
  edit: string;
  show: string;
  delete: string;
  generateChecksModal: string;
  createVacationsModal: string;
  deleteEmployeeVacation: string;
  deleteVacation: string;
};

// Employee Handlers
const handleCreateEmployee = async (employee: Employee) => {
  "use server";
  try {
    console.log("Creating employee", employee);
    await createEmployee(employee);
  } catch (error) {
    console.error("Error creating employee", error);
  }
};

const handleModifyEmployee = async (employee: Employee) => {
  "use server";
  try {
    console.log("Updating employee", employee);
    await updateEmployee(employee.id, employee);
  } catch (error) {
    console.error("Error updating employee", error);
  }
};

const handleDeleteEmployee = async (employee: Employee) => {
  "use server";
  try {
    console.log("Deleting employee", employee);
    await deleteEmployee(employee);
  } catch (error) {
    console.error("Error deleting employee", error);
  }
};

const handleSubmitVacations = async (vacation: Vacation) => {
  "use server";
  try {
    console.log("Creating vacation", vacation);
    await createVacation(vacation);
  } catch (error) {
    console.error("Error creating vacation", error);
  }
}

const handleDeleteVacation = async (vacation: Vacation) => {
  "use server";
  try {
    console.log("Deleting vacation", vacation);
    await deleteVacation(vacation);
  } catch (error) {
    console.error("Error deleting vacation", error);
  }
}

// Employees Page Component
export default async function EmployeesPage({ searchParams, params }: { searchParams: SearchParamProps, params: { companyId: number } }) {
  const { show, edit, delete: deleteId, generateChecksModal, createVacationsModal, deleteEmployeeVacation, deleteVacation } = searchParams;
  let selectedVacation;
  const employees = await fetchCompanyEmployees(params.companyId);
  if (deleteEmployeeVacation && deleteVacation) {
    console.log("Deleting vacation", deleteVacation, "from employee", deleteEmployeeVacation);
    console.log("Employees total: ", employees);

    console.log("Employee has vacation: ", employees.find((emp) => emp.id === parseInt(deleteEmployeeVacation)));
    console.log("Vacation to delete: ", employees.find((emp) => emp.id === parseInt(deleteEmployeeVacation))?.vacations.find((vac: Vacation) => vac.id === parseInt(deleteVacation)));

    selectedVacation = employees.find((emp) => emp.id === parseInt(deleteEmployeeVacation))?.vacations.find((vac: Vacation) => vac.id === parseInt(deleteVacation))
  }

  try {
    const company = await fetchCompany(params.companyId);
    if (!company) return <div>Empresa no encontrada</div>;

    const employees: Employee[] = await fetchCompanyEmployees(company.id);
    const baseURL = `/companies/${params.companyId}/employees`;

    return (
      <section className="flex flex-col items-center justify-center h-screen flex-grow mx-7">
        <Link className='bg-blue-500 hover:bg-blue-600 text-white m-5 p-2 rounded' href="/companies">Volver a empresas</Link>
        <MainTitle>Empleados de {company.name}</MainTitle>

        <div className="grid auto-rows-auto grid-cols-1 gap-4 max-h-[60vh] max-w-[60vw] w-full overflow-y-scroll mt-auto flex-grow">
          {employees.map((employee) => (
            <div key={employee.id} >
              <div className="flex flex-col md:flex-row gap-5 bg-white p-4 rounded shadow md:max-h-28">
                <div>
                  <h2 className='text-black font-bold'>{employee.name}</h2>
                  <p>DNI: {employee.dni}</p>
                  <p>NSS: {employee.nss}</p>
                </div>
                <div className="flex flex-wrap max-w-sm gap-2">
                  <Link className="text-xs size-fit bg-green-500 hover:bg-green-600 text-white p-1 rounded" href={`${baseURL}?edit=${employee.id}`} >EDITAR HORARIO</Link>
                  <Link className="text-xs size-fit bg-blue-600 hover:bg-blue-700 text-white p-1 rounded" href={`${baseURL}?createVacationsModal=${employee.id}`} >AGREGAR VACACIONES</Link>
                  <Link className="text-xs size-fit bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded" href={`${baseURL}?generateChecksModal=${employee.id}`} >GENERAR FICHAJES</Link>
                  <Link className="text-xs size-fit bg-red-500 hover:bg-red-600 text-white p-1 rounded" href={`${baseURL}?delete=${employee.id}`} >ELIMINAR EMPLEADO</Link>
                </div>
                <div className="flex flex-col flex-grow overflow-scroll gap-2">
                  <h3 className='text-black font-bold'>Vacaciones</h3>
                  {employee.vacations.length === 0 ? <div>No se han encontrado vacaciones.</div> : employee.vacations.map((vacation) => (
                    <div key={vacation.id} className="grid grid-cols-3 gap-2 max-w-lg ">
                      <p>Inicio: {formatDate(vacation.start_date)}</p>
                      <p>Fin: {formatDate(vacation.end_date)}</p>
                      {/* Icono de basura para eliminar */}
                      <Link className="bg-red-500 hover:bg-red-600 text-white p-1 rounded size-fit text-sm self-center" href={`${baseURL}?deleteVacation=${vacation.id}&deleteEmployeeVacation=${employee.id}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                          <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='w-full flex justify-end max-w-[60vw] mb-auto'>
          <Link href={`${baseURL}?show=1`} className="bg-blue-500 text-white p-2 rounded mt-4" >Nuevo empleado</Link>
        </div>

        {show && <EmployeeModal title="Crear empleado" baseURL={baseURL} companyId={params.companyId} handleSubmitEmployee={handleCreateEmployee} />}
        {edit && employees.find((emp) => emp.id === parseInt(edit)) && (
          <EmployeeModal title="Editar empleado" baseURL={baseURL} companyId={params.companyId} handleSubmitEmployee={handleModifyEmployee} initialEmployee={
            employees.find((emp) => emp.id === parseInt(edit))
          } submitText="Editar" />
        )}
        {deleteId && employees.find((emp) => emp.id === parseInt(deleteId)) && (
          <EmployeeModal title="Eliminar empresa" baseURL={baseURL} companyId={params.companyId} handleSubmitEmployee={handleDeleteEmployee} initialEmployee={
            employees.find((emp) => emp.id === parseInt(deleteId))
          } deleteEmployee={true} />
        )}
        {generateChecksModal && employees.find((emp) => emp.id === parseInt(generateChecksModal)) && (
          <ChecksModal title="Generar fichajes" baseURL={baseURL} company={company} employee={employees.find((emp) => emp.id === parseInt(generateChecksModal))!} />
        )}
        {createVacationsModal && employees.find((emp) => emp.id === parseInt(createVacationsModal)) && (
          <VacationsModal title="Crear vacaciones" baseURL={baseURL} employee={employees.find((emp) => emp.id === parseInt(createVacationsModal))!} handleSubmitVacations={handleSubmitVacations} />
        )}
        {deleteVacation && deleteEmployeeVacation && selectedVacation && <DeleteVacationModal title="Eliminar vacaciones" baseURL={baseURL} vacation={selectedVacation} deleteVacation={handleDeleteVacation} />}
      </section>
    );
  } catch (error) {
    console.error("Error loading company data", error);
    return <div>Error al cargar los datos de la empresa</div>;
  }
};
