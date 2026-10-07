export interface Employee {
  uniqueId: string;
  firstName: string;
  lastName: string;
  email: string;
  positionUniqueId: string | null;
  seatingPosition: number | null;
  avatarUrl: string | null;
}

export interface Position {
  uniqueId: string;
  jobTitle: string;
  departmentUniqueId: string;
  subDepartmentUniqueId: string | null;
  reportToPositionUniqueId: string | null;
  seatingPosition: number | null;
}
