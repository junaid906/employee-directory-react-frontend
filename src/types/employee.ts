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

export interface Position {
  uniqueId: string;
  jobTitle: string;
  departmentUniqueId: string;
  subDepartmentUniqueId: string | null;
  reportToPositionUniqueId: string | null;
  seatingPosition: number;
}

export interface Department {
  uniqueId: string;
  departmentName: string;
}

export interface SubDepartment {
  uniqueId: string;
  subDepartmentName: string;
  departmentUniqueId: string;
}
