export interface EmployeeFormState {
  firstName: string;
  lastName: string;
  email: string;
  positionUniqueId: string;
  avatarUrl: string;
}

export type EmployeeFormField = keyof EmployeeFormState;
