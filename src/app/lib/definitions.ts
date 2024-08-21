export type Employee = {
    id: number;
    name: string;
    dni: string;
    nss: string;
    companyId: number;
}

export type Company = {
    id: number;
    name: string;
    cif: string;
    address: string;
    cp: string;
    city: string;
}