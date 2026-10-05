export interface Employee {
  uniqueId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  subDepartment: string;
  jobTitle: string;
  reportingToUniqueId: string | null;
  seatingPosition: number | null;
  avatarUrl: string | null;
}
