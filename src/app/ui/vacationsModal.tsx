"use client";
import { useEffect, useState } from "react";
import { Modal } from "./modal";
import { Employee, Vacation } from "../lib/definitions";
import { DeleteButton } from "./buttons";
import { formatDate } from "../lib/utils";

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

export function DeleteVacationModal({ title, baseURL, vacation, deleteVacation }: { title: string, baseURL: string, vacation: Vacation, deleteVacation: (vacation: Vacation) => void }) {
    const [showModal, setShowModal] = useState(true);
    return (
        <Modal
            title={title}
            onClose={() => setShowModal(false)}
            onSubmit={() => deleteVacation(vacation)}
            submitText="Eliminar"
            cancelText="Cancelar"
            baseURL={baseURL}
            submitable={true}
        >
            <div className="flex flex-col gap-2">
                <p>Se van a eliminar las vacaciones del dia {formatDate(vacation.start_date)} al {formatDate(vacation.end_date)}. ¿Estás seguro?</p>
            </div>
        </Modal>
    )
}
