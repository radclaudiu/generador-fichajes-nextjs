import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Company, Employee, Check } from "@/app/lib/definitions";
import { createChecks } from "./data/employees";

export async function generateChecks(employee: Employee, start: Date, end: Date): Promise<Check[]> {
    const checks: Check[] = [];
    for (let date = new Date(start); date < end; date.setDate(date.getDate() + 1)) {
        let schedule;
        console.log("- ",date.toISOString().split('T')[0], " - ", date.getDay());
        switch (date.getDay()) {
            case 0:
                schedule = { start: employee.sunday_in, end: employee.sunday_out };
                break;
            case 1:
                schedule = { start: employee.monday_in, end: employee.monday_out };
                break;
            case 2:
                schedule = { start: employee.tuesday_in, end: employee.tuesday_out };
                break;
            case 3:
                schedule = { start: employee.wednesday_in, end: employee.wednesday_out };
                break;
            case 4:
                schedule = { start: employee.thursday_in, end: employee.thursday_out };
                break;
            case 5:
                schedule = { start: employee.friday_in, end: employee.friday_out };
                break;
            case 6:
                schedule = { start: employee.saturday_in, end: employee.saturday_out };
                break;
        }

        console.log("schedule: ", schedule);

        if (!schedule || schedule.start == null || schedule.end == null) {
            continue;
        }

        console.log("schedule: ", schedule);

        const isVacation = employee.vacations && employee.vacations.some(v => {
            const vacationStart = new Date(v.start_date);
            const vacationEnd = new Date(v.end_date);
            return date >= vacationStart && date <= vacationEnd;
        });

        if (isVacation) {
            continue;
        }

        if (employee.checks.some(c => c.date.toISOString().split('T')[0] == date.toISOString().split('T')[0])) {
            continue;
        }

        const randomStart = new Date(date);
        const [startHour, startMinute] = schedule.start.split(':');
        randomStart.setHours(parseInt(startHour), parseInt(startMinute) - Math.floor(Math.random() * 5) - 1, Math.random() * 60);

        const randomEnd = new Date(date);
        const [endHour, endMinute] = schedule.end.split(':');
        randomEnd.setHours(parseInt(endHour), parseInt(endMinute) + Math.floor(Math.random() * 4) + 1, Math.random() * 60);

        checks.push({
            date: new Date(date.toISOString().split('T')[0]),
            start_time: randomStart,
            end_time: randomEnd,
            employeeId: employee.id
        });
    }
    await createChecks(checks);
    return checks;
}

export function generatePDF(company: Company, employee: Employee, start: Date, end: Date): void {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.text('Registro de Fichajes', 105, 15);

    // Datos de la empresa
    doc.setFontSize(12);
    doc.text(`Empresa: ${company.name}`, 20, 30);
    doc.text(`CIF: ${company.cif}`, 20, 35);
    doc.text(`Dirección: ${company.address}`, 20, 40);
    doc.text(`CP: ${company.cp}, Ciudad: ${company.city}`, 20, 45);

    // Datos del empleado
    doc.text(`Empleado: ${employee.name}`, 20, 55);
    doc.text(`DNI: ${employee.dni}`, 20, 60);
    doc.text(`NSS: ${employee.nss}`, 20, 65);

    // Tabla de fichajes con aquellos fichajes dentro del rango de fechas
    let tableData: string[][] = [];
    employee.checks.forEach(check => {
        check.date = new Date(check.date);
        let start_time1 = check.start_time.toString();
        check.start_time = new Date(check.date);
        check.start_time.setHours(parseInt(start_time1.slice(0, 2)), parseInt(start_time1.slice(3, 5)), parseInt(start_time1.slice(6, 8)));
        let end_time1 = check.end_time.toString();
        check.end_time = new Date(check.date);
        check.end_time.setHours(parseInt(end_time1.slice(0, 2)), parseInt(end_time1.slice(3, 5)), parseInt(end_time1.slice(6, 8)));

        if (check.date >= start && check.date <= end) {
            // Almacenar el recuento de horas del día en el formato HH:MM:SS
            let workedTime = "";
            let hours = Math.floor((check.end_time.getTime() - check.start_time.getTime()) / 3600000);
            let minutes = Math.floor(((check.end_time.getTime() - check.start_time.getTime()) % 3600000) / 60000);
            let seconds = Math.floor(((check.end_time.getTime() - check.start_time.getTime()) % 60000) / 1000);
            workedTime += hours < 10 ? "0" + hours : hours;
            workedTime += ":";
            workedTime += minutes < 10 ? "0" + minutes : minutes;
            workedTime += ":";
            workedTime += seconds < 10 ? "0" + seconds : seconds;


            tableData.push([check.date.toISOString().split('T')[0], check.start_time.toTimeString().slice(0, 8), check.end_time.toTimeString().slice(0, 8), workedTime]);
        }
    });



    // Añadir la tabla al PDF
    autoTable(doc, {
        head: [['Fecha', 'Entrada', 'Salida', 'Horas']],
        body: tableData,
        startY: 75
    });


    // Cálculo del total de horas

    const totalHours = employee.checks.reduce((total, check) => {
        return total + (check.end_time.getTime() - check.start_time.getTime()) / 3600000;
    }, 0);

    const finalY = (doc as any).lastAutoTable.finalY || 75;

    // Añadir el total de horas al PDF sin usar ninguna librería
    doc.text(`Total de horas: ${totalHours.toFixed(2)}`, 15, finalY + 10);

    // Firma del empleado
    doc.text(`Estos fichajes han sido comprobados por el empleado. Firma : `, 15, finalY + 20);


    doc.save(`fichajes_${employee.name}_${start.toISOString().split('T')[0]}_${end.toISOString().split('T')[0]}.pdf`);
}