"use client";
import { useEffect, useState } from "react";
import { Modal } from "./modal";
import { Employee, Vacation } from "../lib/definitions";
import { DeleteButton } from "./buttons";

function VacationsDateField({ text, onChange }: { text: string, onChange: (e: any) => void }) {
    return (
        <div className="flex gap-2">
            <p className="mr-auto">{text}</p>
            <input
                type="date"
                onChange={onChange}
                className="border border-gray-300 rounded p-1 w-48"
                required
            />
        </div>
    );
}

export function VacationsModal({ title, baseURL, employee, handleSubmitVacations, initialVacation = {
    id: 0,
    start_date: new Date(),
    end_date: new Date(),
    employee_id: employee.id
}, cancelText, submitText }: { title: string, baseURL: string, employee: Employee, handleSubmitVacations: (vacation: Vacation) => void, initialVacation?: Vacation, cancelText?: string, submitText?: string }) {
    const [showModal, setShowModal] = useState(true);
    const [vacation, setVacation] = useState(initialVacation);
    const submitable: boolean = vacation.start_date !== undefined && vacation.end_date !== undefined;

    return (<div>{showModal && (
        <Modal
            title={title}
            onClose={() => setShowModal(false)}
            onSubmit={() => handleSubmitVacations(vacation)}
            submitText={submitText ?? "Guardar"}
            cancelText={cancelText ?? "Cancelar"}
            baseURL={baseURL}
            submitable={submitable}
        >
            <form className="flex flex-col gap-2">
                <VacationsDateField text="Inicio" onChange={(e) => setVacation({...vacation, start_date: new Date(e.target.value)})} />
                <VacationsDateField text="Fin" onChange={(e) => setVacation({...vacation, end_date: new Date(e.target.value)})} />
            </form>
        </Modal>
    )}</div>);
}

export function ShowVacationsModal({ title, baseURL, employee, cancelText, deleteVacations }: { title: string, baseURL: string, employee: Employee, cancelText?: string, deleteVacations: (vacation: Vacation) => void }) {
    const [showModal, setShowModal] = useState(true);
    const [vacations, setVacations] = useState<Vacation[]>([]);
    useEffect(() => {
        // Fetch vacations
        fetch(`/api/v0/employees/${employee.id}/vacations`) // Fetch vacations from employee
            .then((response) => response.json())
            .then((data) => {
                data = data.map((v: any) => ({
                    id: v.id,
                    start_date: new Date(v.start_date),
                    end_date: new Date(v.end_date),
                    employee_id: v.employee_id
                }));
                setVacations(data);
            });
    }, []);
    
    console.log("Vacaciones del empleado: ", vacations);
    

    if (vacations.length === 0) {
        return (<div>{showModal && (
            <Modal
                title={title}
                onClose={() => setShowModal(false)}
                cancelText={cancelText ?? "Cerrar"}
                submitText=""
                baseURL={baseURL}
                submitable={false}
                onSubmit={() => { }}
            >
                <div className="flex flex-col gap-2">
                    No se han encontrado vacaciones.
                </div>
            </Modal>
        )}</div>)
        ;
    }    

    return (<div>{showModal && (
        <Modal
            title={title}
            onClose={() => setShowModal(false)}
            cancelText={cancelText ?? "Cerrar"}
            submitText=""
            baseURL={baseURL}
            submitable={false}
            onSubmit={() => { }}
        >
            <div className="flex flex-col gap-2">
                {vacations.map((vacation) => (
                    <div key={vacation.id} className="flex gap-2">
                        <p>Inicio: {vacation.start_date.toISOString().split("T")[0]}</p>
                        <p>Fin: {vacation.end_date.toISOString().split("T")[0]}</p>
                        <DeleteButton onClick={() => {
                            console.log("Eliminando vacaciones",vacation);
                            deleteVacations(vacation)}}>Eliminar</DeleteButton>
                    </div>
                ))}
            </div>
        </Modal>
    )}</div>);
}
