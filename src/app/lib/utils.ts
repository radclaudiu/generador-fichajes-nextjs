import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Company, Employee, Check } from "@/app/lib/definitions";
import { createChecks } from "./data/employees";

export async function generateChecks(employee: Employee, start: Date, end: Date): Promise<Check[]> {
    const checks: Check[] = [];
    const schedules = [
        { start: employee.sunday_in, end: employee.sunday_out },   // Domingo
        { start: employee.monday_in, end: employee.monday_out },   // Lunes
        { start: employee.tuesday_in, end: employee.tuesday_out }, // Martes
        { start: employee.wednesday_in, end: employee.wednesday_out }, // Miércoles
        { start: employee.thursday_in, end: employee.thursday_out }, // Jueves
        { start: employee.friday_in, end: employee.friday_out },   // Viernes
        { start: employee.saturday_in, end: employee.saturday_out }  // Sábado
    ];

    const employeeChecksSet = new Set(employee.checks.map(c => c.date.toISOString().split('T')[0]));
    const vacationPeriods = employee.vacations?.map(v => ({
        start: new Date(v.start_date),
        end: new Date(v.end_date)
    })) || [];

    for (let date = new Date(start); date < end; date.setDate(date.getDate() + 1)) {
        const daySchedule = schedules[date.getDay()];
        const dateString = date.toISOString().split('T')[0];

        if (!daySchedule?.start || !daySchedule?.end) continue;
        if (vacationPeriods.some(v => date >= v.start && date <= v.end)) continue;
        if (employeeChecksSet.has(dateString)) continue;

        const randomStart = new Date(date);
        const [startHour, startMinute] = daySchedule.start.split(':');
        randomStart.setHours(parseInt(startHour), parseInt(startMinute) - Math.floor(Math.random() * 5) - 1, Math.random() * 60);

        const randomEnd = new Date(date);
        const [endHour, endMinute] = daySchedule.end.split(':');
        randomEnd.setHours(parseInt(endHour), parseInt(endMinute) + Math.floor(Math.random() * 4) + 1, Math.random() * 60);

        checks.push({
            date: new Date(dateString),
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
    doc.text('Registro de fichajes', 105, 15, { align: 'center' });

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

            let day = String(check.date.getDate()).padStart(2, '0');
            let month = String(check.date.getMonth() + 1).padStart(2, '0'); // Los meses comienzan en 0
            let year = check.date.getFullYear();
            
            let formattedDate = `${day}-${month}-${year}`;

            tableData.push([formattedDate, check.start_time.toTimeString().slice(0, 8), check.end_time.toTimeString().slice(0, 8)]);
        }
    });



    // Añadir la tabla al PDF
    autoTable(doc, {
        head: [['Fecha', 'Entrada', 'Salida']],
        body: tableData,
        startY: 75,
        styles: { halign: 'center' }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 75;

    // Firma del empleado
    doc.text(`Estos fichajes han sido comprobados por el empleado.\n\n\n Firma : `, 15, finalY + 10);

    let dayStart = String(start.getDate()).padStart(2, '0');
    let monthStart = String(start.getMonth() + 1).padStart(2, '0'); // Los meses comienzan en 0
    let yearStart = start.getFullYear();
    
    let formattedDateStart = `${dayStart}-${monthStart}-${yearStart}`;
    let dayEnd = String(start.getDate()).padStart(2, '0');
    let monthEnd = String(start.getMonth() + 1).padStart(2, '0'); // Los meses comienzan en 0
    let yearEnd = start.getFullYear();
    
    let formattedDateEnd = `${dayEnd}-${monthEnd}-${yearEnd}`;

    doc.save(`fichajes_${formattedDateStart}_${formattedDateEnd}.pdf`);
}