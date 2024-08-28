import { ReactNode } from "react";
import Link from "next/link";

interface ModalProps {
    title: string;
    onClose: () => void;
    onSubmit: () => void;
    submitText: string;
    cancelText: string;
    baseURL: string;
    submitable: boolean;
    children: ReactNode;
}

export function Modal({ title, onClose, onSubmit, submitText, cancelText, baseURL, submitable, children }: ModalProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-black font-bold">{title}</h2>
                </div>
                {children}
                <div className="flex justify-end gap-2 mt-5">
                    <Link onClick={onClose} href={baseURL} className='bg-red-500 hover:bg-red-600 text-white p-2 rounded'>{cancelText}</Link>
                    {/* Hide the Link if theres no submit text */}
                    {submitText.length > 0 && (
                        <Link onClick={
                            submitable ? onSubmit : (e) => e.preventDefault()
                        } href={baseURL} className={`bg-green-500 hover:bg-green-600 text-white p-2 rounded ${submitable ? "" : "cursor-not-allowed"}`} >{submitText}</Link>
                    )}


                </div>
            </div>
        </div>
    );
}