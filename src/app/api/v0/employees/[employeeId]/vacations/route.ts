import { fetchEmployee, fetchEmployeeVacations } from "@/app/lib/data/employees";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: any): Promise<NextResponse> {
    const { employeeId } = context.params;
    const vacations = await fetchEmployeeVacations(employeeId);
    console.log("Fetched vacations endpoint from employee number ",employeeId,": ", vacations);
    
    return NextResponse.json(vacations);
  }