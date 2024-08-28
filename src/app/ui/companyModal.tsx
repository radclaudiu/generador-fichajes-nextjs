"use client";

import { useState } from "react";
import { Company } from "@/app/lib/definitions";
import { Modal } from "@/app/ui/modal";

function CompanyField({ text, type, value, onChange }: { text: string, type: string, value: string, onChange: (e: any) => void }) {
    return (
        <label className="flex justify-between gap-10">
            {text}
            <input
                type={type}
                value={value}
                onChange={onChange}
                className="border border-gray-300 rounded p-1 w-48"
                required
            />
        </label>
    );
}


export default function CompanyModal({ title, baseURL, handleSubmitCompany, initialCompany = { id: 0, name: "", cif: "", address: "", cp: "", city: "" }, deleteCompany = false }: { title: string, baseURL: string, handleSubmitCompany: (company: Company) => void, initialCompany?: Company, deleteCompany?: boolean }) {
    const [showModal, setShowModal] = useState(true);
    const [company, setCompany] = useState<Company>(initialCompany);
    // set submitable to true if all fields are filled
    const submitable: boolean = company.name !== "" && company.cif !== "" && company.address !== "" && company.cp !== "" && company.city !== "";
    if (deleteCompany) {
        return (
            <Modal
                title={title}
                onClose={() => setShowModal(false)}
                onSubmit={() => handleSubmitCompany(company)}
                submitText="Eliminar"
                cancelText="Cancelar"
                baseURL={baseURL}
                submitable={submitable}
            >
                <div className="flex flex-col gap-2">
                    <p>¿Estás seguro de que quieres eliminar la empresa?</p>
                </div>
            </Modal>
        )
    };


    return (<div>{showModal && (
        <Modal
            title={title}
            onClose={() => setShowModal(false)}
            onSubmit={() => handleSubmitCompany(company)}
            submitText="Crear"
            cancelText="Cancelar"
            baseURL={baseURL}
            submitable={submitable}

        >
            <form className="flex flex-col gap-2">
                <CompanyField
                    text="Nombre"
                    type="text"
                    value={company.name}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })} />
                <CompanyField
                    text="CIF"
                    type="text"
                    value={company.cif}
                    onChange={(e) => setCompany({ ...company, cif: e.target.value })} />
                <CompanyField
                    text="Dirección"
                    type="text"
                    value={company.address}
                    onChange={(e) => setCompany({ ...company, address: e.target.value })} />
                <CompanyField
                    text="CP"
                    type="text"
                    value={company.cp}
                    onChange={(e) => setCompany({ ...company, cp: e.target.value })} />
                <CompanyField
                    text="Ciudad"
                    type="text"
                    value={company.city}
                    onChange={(e) => setCompany({ ...company, city: e.target.value })} />
            </form>
        </Modal>
    )
    }
    </div >
    )
}
