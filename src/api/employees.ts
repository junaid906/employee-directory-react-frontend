import { apiClient } from "./client";
import type { Employee } from "../types/employee";

export async function listEmployees(): Promise<Employee[]> {
  const { data } = await apiClient.get<Employee[]>("/employees/");
  return data;
}

export async function getEmployee(id: string): Promise<Employee> {
  const { data } = await apiClient.get<Employee>(`/employees/${id}`);
  return data;
}
