export type Employee = {
    id: number;
    name: string;
    dni: string;
    nss: string;
    monday_in: string;
    monday_out: string;
    tuesday_in: string;
    tuesday_out: string;
    wednesday_in: string;
    wednesday_out: string;
    thursday_in: string;
    thursday_out: string;
    friday_in: string;
    friday_out: string;
    saturday_in: string;
    saturday_out: string;
    sunday_in: string;
    sunday_out: string;
    vacations: Vacation[];
    checks: Check[];
    companyId: number;
}

export type Vacation = {
    id: number;
    start_date: string;
    end_date: string;
    employee_id: number;
}

export type Company = {
    id: number;
    name: string;
    cif: string;
    address: string;
    cp: string;
    city: string;
}

export type Check = {
    date: Date;
    start_time: Date;
    end_time: Date;
    employeeId: number;
}

export type Schedule = {
    start: string;
    end: string;
    employeeId: number;
}