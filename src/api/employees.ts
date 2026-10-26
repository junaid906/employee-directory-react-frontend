import { apiClient } from "./client";
import type {
  Employee,
  DetailedEmployee,
  EmployeeFilters,
  InsertPositionDto,
  UpdatePositionDto,
  ReparentPositionsDto,
  Position,
  Department,
  SubDepartment,
} from "../types/employee";

function stripEmptyFields(data: object): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(data).filter(
      ([, value]) => value !== undefined && value !== "",
    ),
  );
}

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

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  positionUniqueId: string;
  avatarUrl: string | null;
  role: number;
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

export async function getPosition(id: string): Promise<Position> {
  const { data } = await apiClient.get<Position>(`/positions/${id}`);
  return data;
}

export interface CreatePositionDto {
  jobTitle: string;
  departmentUniqueId: string;
  subDepartmentUniqueId: string | null;
  reportToPositionUniqueId: string | null;
  seatingPosition: number;
}

export async function createPosition(
  data: CreatePositionDto,
): Promise<Position> {
  const { data: position } = await apiClient.post<Position>("/positions", data);
  return position;
}

export async function insertPosition(
  data: InsertPositionDto,
): Promise<Position> {
  const { data: position } = await apiClient.post<Position>(
    "/positions/insert-between",
    data,
  );
  return position;
}

export async function updatePosition(
  uniqueId: string,
  data: UpdatePositionDto,
): Promise<Position> {
  const { data: position } = await apiClient.put<Position>(
    `/positions/${uniqueId}`,
    stripEmptyFields({ ...data }),
  );
  return position;
}

export async function reparentPositions(
  data: ReparentPositionsDto,
): Promise<void> {
  await apiClient.post("/positions/reparent", stripEmptyFields({ ...data }));
}

export async function getDepartments(): Promise<Department[]> {
  const { data } = await apiClient.get<Department[]>("/departments");
  return data;
}

export async function getSubDepartments(): Promise<SubDepartment[]> {
  const { data } = await apiClient.get<SubDepartment[]>("/subdepartments");
  return data;
}
