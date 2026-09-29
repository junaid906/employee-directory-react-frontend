export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  subDepartment: string;
  jobTitle: string;
  reportingTo: number | null;
  seatingPosition: number | null;
  avatarUrl: string | null;
}
