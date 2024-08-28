import { fetchEmployee } from "@/app/lib/data/employees";
import { generateChecks } from "@/app/lib/utils";
import { log } from "console";
import { NextResponse } from "next/server";

// POST function that generates checks for an employee receiving the employeeId and the start and end dates as parameters
export async function POST(request: Request, context: any): Promise<NextResponse> {
    const { employeeId } = context.params;
    const { start, end } = await request.json();
    try {
        const employee = await fetchEmployee(employeeId);
        console.log('Generating checks for employee:', employee, new Date(start), new Date(end));
        
        await generateChecks(employee, new Date(start), new Date(end));
        const updatedEmployee = await fetchEmployee(employeeId);
        return NextResponse.json( updatedEmployee );
    } catch (error) {
        console.log('Database Error:', error);
        return NextResponse.json({ error: 'Failed to generate checks.' }, { status: 500 });
    }
}