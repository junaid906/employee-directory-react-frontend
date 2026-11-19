import type { Department, SubDepartment } from "./department";
import type { Position } from "./position";

export interface Employee {
  uniqueId: string;
  firstName: string;
  lastName: string;
  email: string;
  positionUniqueId: string;
  avatarUrl: string | null;
}

export interface EmployeeFilters {
  departmentUniqueId?: string;
  subDepartmentUniqueId?: string;
  positionUniqueId?: string;
  role?: number;
  search?: string;
}

export interface DetailedEmployee {
  uniqueId: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  position: Position;
  department: Department;
  subDepartment: SubDepartment | null;
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  positionUniqueId: string;
  avatarUrl: string | null;
  role: number;
}
