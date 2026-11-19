import { apiClient } from "./client";
import type { Department, SubDepartment } from "../types/department";

export async function getDepartments(): Promise<Department[]> {
  const { data } = await apiClient.get<Department[]>("/departments");
  return data;
}

export async function getSubDepartments(): Promise<SubDepartment[]> {
  const { data } = await apiClient.get<SubDepartment[]>("/subdepartments");
  return data;
}
