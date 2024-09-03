import { fetchEmployee } from "@/app/lib/data/employees";
import { generateChecks } from "@/app/lib/utils";
import { log } from "console";
import { NextResponse } from "next/server";

// POST function that generates checks for an employee receiving the employeeId and the start and end dates as parameters
export async function POST(request: Request, context: any): Promise<NextResponse> {
    const { employeeId } = context.params;
    const { start, end } = await request.json();
    console.log('Generating checks for employee number:', employeeId);
    
    try {
        const employee = await fetchEmployee(employeeId);
        console.log('Generating checks for employee:', employee, new Date(start), new Date(end));
        
        await generateChecks(employee, new Date(start), new Date(end));
        const updatedEmployee = await fetchEmployee(employeeId);
        console.log('Checks generated successfully returning employee: ', updatedEmployee);
        
        return NextResponse.json( updatedEmployee);
    } catch (error) {
        console.log('Error generating checks:', error);
        return NextResponse.json({ error: 'Failed to generate checks.' }, { status: 500 });
    }
}