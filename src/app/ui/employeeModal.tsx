"use client";

import { useState } from "react";
import { Employee } from "@/app/lib/definitions";
import { Modal } from "@/app/ui/modal";



function EmployeeField({ text, type, value, onChange }: { text: string, type: string, value: string, onChange: (e: any) => void }) {
    return (
        <label className="flex justify-between gap-10">
            {text}
            <input
                type={type}
                value={value ?? ''}
                onChange={onChange}
                className="border border-gray-300 rounded p-1 w-48"
                required
            />
        </label>
    );
}

function EmployeeTimeField({ text, value, onChange }: { text: string, value: string, onChange: (e: any) => void }) {
    return (
        <label className="flex justify-between gap-10">
            {text}
            <input
                value={value ?? ''}
                type="time"
                onChange={onChange}
                className="border border-gray-300 rounded p-1"
                required
            />
        </label>
    );
}


export function EmployeeModal({ title, baseURL, companyId, handleSubmitEmployee, initialEmployee =
    {
        id: 0,
        name: "",
        dni: "",
        nss: "",
        monday_in: "",
        monday_out: "",
        tuesday_in: "",
        tuesday_out: "",
        wednesday_in: "",
        wednesday_out: "",
        thursday_in: "",
        thursday_out: "",
        friday_in: "",
        friday_out: "",
        saturday_in: "",
        saturday_out: "",
        sunday_in: "",
        sunday_out: "",
        vacations: [],
        checks: [],
        companyId: companyId
    }, deleteEmployee,
cancelText, submitText }: { title: string, baseURL: string, companyId: number, handleSubmitEmployee: (employee: Employee) => void, initialEmployee?: Employee, deleteEmployee?: boolean, cancelText?: string, submitText?: string }) {
    const [showModal, setShowModal] = useState(true);
    initialEmployee.companyId = companyId;
    const [employee, setEmployee] = useState<Employee>(initialEmployee);
    // set submitable to true if all fields are filled
    const submitable: boolean = employee.name !== "" && employee.dni !== "" && employee.nss !== "";

    if (deleteEmployee) {
        return (
            <Modal
                title={title}
                onClose={() => setShowModal(false)}
                onSubmit={() => handleSubmitEmployee(employee)}
                submitText="Eliminar"
                cancelText="Cancelar"
                baseURL={baseURL}
                submitable={true}
            >
                <div className="flex flex-col gap-2">
                    <p>¿Estás seguro de que quieres eliminar el empleado?</p>
                </div>
            </Modal>
        )
    };

    return (<div>{showModal && (
        <Modal
            title={title}
            onClose={() => setShowModal(false)}
            onSubmit={() => handleSubmitEmployee(employee)}
            submitText={submitText ?? "Confirmar"}	
            cancelText={cancelText ?? "Cancelar"}
            baseURL={baseURL}
            submitable={submitable}

        >
            <form className="flex flex-col gap-2">
                <EmployeeField
                    text="Nombre"
                    type="text"
                    value={employee.name}
                    onChange={(e) => setEmployee({ ...employee, name: e.target.value })} />
                <EmployeeField
                    text="DNI"
                    type="text"
                    value={employee.dni}
                    onChange={(e) => setEmployee({ ...employee, dni: e.target.value })} />
                <EmployeeField
                    text="NSS"
                    type="text"
                    value={employee.nss}
                    onChange={(e) => setEmployee({ ...employee, nss: e.target.value })} />
                <div className="flex gap-2">
                    <p className="mr-auto">Lunes</p>
                    <EmployeeTimeField
                        text=""
                        value={employee.monday_in}
                        onChange={(e) => setEmployee({ ...employee, monday_in: e.target.value })} />
                    <p> - </p>
                    <EmployeeTimeField
                        text=""
                        value={employee.monday_out}
                        onChange={(e) => setEmployee({ ...employee, monday_out: e.target.value })} />
                </div>
                <div className="flex gap-2">
                <p className="mr-auto">Martes</p>
                    <EmployeeTimeField
                        text=""
                        value={employee.tuesday_in}
                        onChange={(e) => setEmployee({ ...employee, tuesday_in: e.target.value })} />
                    <p> - </p>
                    <EmployeeTimeField
                        text=""
                        value={employee.tuesday_out}
                        onChange={(e) => setEmployee({ ...employee, tuesday_out: e.target.value })} />
                </div>
                <div className="flex gap-2">
                    <p className="mr-auto">Miércoles</p>
                    <EmployeeTimeField
                        text=""
                        value={employee.wednesday_in}
                        onChange={(e) => setEmployee({ ...employee, wednesday_in: e.target.value })} />
                    <p> - </p>
                    <EmployeeTimeField
                        text=""
                        value={employee.wednesday_out}
                        onChange={(e) => setEmployee({ ...employee, wednesday_out: e.target.value })} />
                </div>
                <div className="flex gap-2">
                    <p className="mr-auto">Jueves</p>
                    <EmployeeTimeField
                        text=""
                        value={employee.thursday_in}
                        onChange={(e) => setEmployee({ ...employee, thursday_in: e.target.value })} />
                    <p> - </p>
                    <EmployeeTimeField
                        text=""
                        value={employee.thursday_out}
                        onChange={(e) => setEmployee({ ...employee, thursday_out: e.target.value })} />
                </div>
                <div className="flex gap-2">
                    <p className="mr-auto">Viernes</p>
                    <EmployeeTimeField
                        text=""
                        value={employee.friday_in}
                        onChange={(e) => setEmployee({ ...employee, friday_in: e.target.value })} />
                    <p> - </p>
                    <EmployeeTimeField
                        text=""
                        value={employee.friday_out}
                        onChange={(e) => setEmployee({ ...employee, friday_out: e.target.value })} />
                </div>
                <div className="flex gap-2">
                    <p className="mr-auto">Sábado</p>
                    <EmployeeTimeField
                        text=""
                        value={employee.saturday_in}
                        onChange={(e) => setEmployee({ ...employee, saturday_in: e.target.value })} />
                    <p> - </p>
                    <EmployeeTimeField
                        text=""
                        value={employee.saturday_out}
                        onChange={(e) => setEmployee({ ...employee, saturday_out: e.target.value })} />
                </div>
                <div className="flex gap-2">
                    <p className="mr-auto">Domingo</p>
                    <EmployeeTimeField
                        text=""
                        value={employee.sunday_in}
                        onChange={(e) => setEmployee({ ...employee, sunday_in: e.target.value })} />
                    <p> - </p>
                    <EmployeeTimeField
                        text=""
                        value={employee.sunday_out}
                        onChange={(e) => setEmployee({ ...employee, sunday_out: e.target.value })} />
                </div>
            </form>
        </Modal>
    )
    }
    </div >
    )
}
