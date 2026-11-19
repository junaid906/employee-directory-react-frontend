import { apiClient, stripEmptyFields } from "./client";
import type {
  CreateEmployeeDto,
  DetailedEmployee,
  Employee,
  EmployeeFilters,
} from "../types/employee";

export async function listEmployees(
  filters?: EmployeeFilters,
): Promise<Employee[]> {
  const { data } = await apiClient.get<Employee[]>("/employees/", {
    params: stripEmptyFields({ ...filters }),
  });
  return data;
}

export async function getEmployee(id: string): Promise<DetailedEmployee> {
  const { data } = await apiClient.get<DetailedEmployee>(`/employees/${id}`);
  return data;
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

export async function deactivateEmployee(id: string): Promise<void> {
  await apiClient.post(`/employees/deactivate-employee/${id}`);
}
