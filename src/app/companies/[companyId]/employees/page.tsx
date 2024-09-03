import Link from 'next/link';
import React from 'react';

// Types and Definitions
import { Employee, Vacation } from '@/app/lib/definitions';

// Data Fetching Functions
import { fetchCompany, fetchCompanyEmployees } from '@/app/lib/data/companies';
import { createEmployee, createVacation, deleteEmployee, deleteVacation, fetchEmployee, updateEmployee } from '@/app/lib/data/employees';

// UI Components
import { MainTitle } from '@/app/ui/titles';
import { EmployeeModal } from '@/app/ui/employeeModal';
import { ChecksModal } from '@/app/ui/checksModal';
import { ShowVacationsModal, VacationsModal } from '@/app/ui/vacationsModal';

// Types for Search Parameters
type SearchParamProps = {
  edit: string;
  show: string;
  delete: string;
  generateChecksModal: string;
  createVacationsModal: string;
  showVacations: string;
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
  console.log("Deleting vacation", vacation);
  
  try {
    console.log("Deleting vacation", vacation);
    await deleteVacation(vacation);
  } catch (error) {
    console.error("Error deleting vacation", error);
  }
}

// Employees Page Component
export default async function EmployeesPage({ searchParams, params }: { searchParams: SearchParamProps, params: { companyId: number } }) {
  const { show, edit, delete: deleteId, generateChecksModal, createVacationsModal, showVacations } = searchParams;

  try {
    const company = await fetchCompany(params.companyId);
    if (!company) return <div>Empresa no encontrada</div>;

    const employees: Employee[] = await fetchCompanyEmployees(company.id);
    const baseURL = `/companies/${params.companyId}/employees`;

    return (
      <section className="flex flex-col items-center justify-center h-screen flex-grow mx-7">
        <Link className='bg-blue-500 hover:bg-blue-600 text-white m-5 p-2 rounded' href="/companies">Volver a empresas</Link>
        <MainTitle>Empleados de {company.name}</MainTitle>

        <div className="grid auto-rows-auto grid-cols-1 justify-evenly gap-4 max-h-[60vh] max-w-[60vw] w-full overflow-y-scroll mt-auto flex-grow">
          {employees.map((employee) => (
            <div key={employee.id}>
              <div className="flex flex-row gap-5 bg-white p-4 rounded shadow">
                <div>
                  <h2 className='text-black font-bold'>{employee.name}</h2>
                  <p>DNI: {employee.dni}</p>
                  <p>NSS: {employee.nss}</p>
                </div>
                <div className="flex flex-wrap mt-4 gap-2">
                  <Link className="bg-green-500 hover:bg-green-600 text-white p-2 rounded" href={`${baseURL}?edit=${employee.id}`} >EDITAR HORARIO</Link>
                  <Link className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded" href={`${baseURL}?createVacationsModal=${employee.id}`} >AGREGAR VACACIONES</Link>
                  <Link className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded" href={`${baseURL}?showVacations=${employee.id}`} >VER VACACIONES</Link>
                  <Link className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded" href={`${baseURL}?generateChecksModal=${employee.id}`} >GENERAR FICHAJES</Link>
                  <Link className="bg-red-500 hover:bg-red-600 text-white p-2 rounded" href={`${baseURL}?delete=${employee.id}`} >ELIMINAR EMPLEADO</Link>
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
        {showVacations && <ShowVacationsModal title="Vacaciones" baseURL={baseURL} vacations={employees.find((emp) => emp.id === parseInt(showVacations))?.vacations!} deleteVacations={handleDeleteVacation} />}
      </section>
    );
  } catch (error) {
    console.error("Error loading company data", error);
    return <div>Error al cargar los datos de la empresa</div>;
  }
};
