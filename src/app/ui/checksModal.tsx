"use client";

import { Modal } from '@/app/ui/modal';
import { useState } from "react";
import { Company, Employee } from '@/app/lib/definitions';
import { generatePDF } from '../lib/utils';


const generateChecksHandler = async (company: Company, employee: Employee, start: Date, end: Date) => {
    "use client";
    await fetch(`/api/v0/employees/${employee.id}/generateChecks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ start, end }),
    }).then(async (response) => {
        if (response.ok) {
            let updatedEmployee = await response.json();
            console.log("Checks generated successfully");
            await generatePDF(company, updatedEmployee, start, end);
            alert("Fichajes generados correctamente");
        } else {
            console.error("Failed to generate checks");
        }
    }
    );



    console.log("Generating checks for employee from", start, "to", end);
}

export function ChecksModal({company, employee, title, baseURL }: { company: Company, employee: Employee, title: string, baseURL: string }) {
    // Create modal that when confirmed, callls handleSubmitChecks passing the employee and the start and end dates
    const [showModal, setShowModal] = useState(true);
    const [start, setStart] = useState<Date>(new Date());
    const [end, setEnd] = useState<Date>(new Date());
    const submitable: boolean = start !== undefined && end !== undefined;

    return (<div>{showModal && (
        <Modal
            title={title}
            onClose={() => setShowModal(false)}
            onSubmit={() => generateChecksHandler(company, employee, start, end)}
            submitText="Generar"
            cancelText="Cancelar"
            baseURL={baseURL}
            submitable={submitable}
        >
            <form className="flex flex-col gap-2">
                <label className="flex justify-between gap-10">
                    Inicio
                    <input
                        type="date"
                        value={start?.toISOString().split('T')[0]}
                        onChange={(e) => setStart(new Date(e.target.value))}
                        className="border border-gray-300 rounded p-1 w-48"
                        required
                    />
                </label>
                <label className="flex justify-between gap-10">
                    Fin
                    <input
                        type="date"
                        value={end?.toISOString().split('T')[0]}
                        onChange={(e) => setEnd(new Date(e.target.value))}
                        className="border border-gray-300 rounded p-1 w-48"
                        required
                    />
                </label>
            </form>
        </Modal>
    )}</div>);
}