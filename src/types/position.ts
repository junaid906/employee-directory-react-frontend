export interface Position {
  uniqueId: string;
  jobTitle: string;
  departmentUniqueId: string;
  subDepartmentUniqueId: string | null;
  reportToPositionUniqueId: string | null;
  seatingPosition: number;
}

export interface InsertPositionDto {
  jobTitle: string;
  departmentUniqueId: string;
  subDepartmentUniqueId: string | null;
  seatingPosition: number;
  reportToPositionUniqueId: string | null;
  childPositionUniqueIds: string[];
}

export interface UpdatePositionDto {
  jobTitle: string;
  departmentUniqueId: string;
  subDepartmentUniqueId: string | null;
  seatingPosition: number;
}

export interface ReparentPositionsDto {
  reportToPositionUniqueId: string;
  childPositionUniqueIds: string[];
}
