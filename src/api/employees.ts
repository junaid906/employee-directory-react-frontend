import { apiClient } from "./client";
import type { Employee, Position } from "../types/employee";

export type { Position };

export async function listEmployees(): Promise<Employee[]> {
  const { data } = await apiClient.get<Employee[]>("/employees/");
  return data;
}

export async function getEmployee(id: string): Promise<Employee> {
  const { data } = await apiClient.get<Employee>(`/employees/${id}`);
  console.log(data);
  return data;
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  positionUniqueId: string | null;
  avatarUrl: string | null;
}

export async function createEmployee(
  data: CreateEmployeeDto,
): Promise<Employee> {
  const { data: employee } = await apiClient.post<Employee>(
    "/employees/create-employee",
    data,
  );
  return employee;
}

export interface ManagerSummary {
  uniqueId: string;
  firstName: string;
  lastName: string;
}

export async function getManagersSummarised(): Promise<ManagerSummary[]> {
  const { data } = await apiClient.get<ManagerSummary[]>(
    "/employees/managers-summarised",
  );
  return data;
}

export async function getPositions(): Promise<Position[]> {
  const { data } = await apiClient.get<Position[]>("/positions");
  return data;
}
