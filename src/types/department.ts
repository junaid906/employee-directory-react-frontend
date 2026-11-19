export interface Department {
  uniqueId: string;
  departmentName: string;
}

export interface SubDepartment {
  uniqueId: string;
  subDepartmentName: string;
  departmentUniqueId: string;
}
