import { useState } from "react";
import type {
  InsertPositionDto,
  UpdatePositionDto,
} from "../types/position";

export interface PositionFormInitial {
  jobTitle: string;
  departmentUniqueId: string;
  subDepartmentUniqueId: string;
  reportToPositionUniqueId?: string;
  childPositionUniqueIds?: string[];
  seatingPosition: string;
}

export function usePositionFormState(initial: PositionFormInitial) {
  const [jobTitle, setJobTitle] = useState(initial.jobTitle);
  const [departmentUniqueId, setDepartmentUniqueId] = useState(
    initial.departmentUniqueId,
  );
  const [subDepartmentUniqueId, setSubDepartmentUniqueId] = useState(
    initial.subDepartmentUniqueId,
  );
  const [reportToPositionUniqueId, setReportToPositionUniqueId] = useState(
    initial.reportToPositionUniqueId ?? "",
  );
  const [childPositionUniqueIds, setChildPositionUniqueIds] = useState<string[]>(
    initial.childPositionUniqueIds ?? [],
  );
  const [seatingPosition, setSeatingPosition] = useState(
    initial.seatingPosition,
  );

  function handleDepartmentChange(value: string) {
    setDepartmentUniqueId(value);
    setSubDepartmentUniqueId("");
  }

  function handleParentChange(value: string) {
    setReportToPositionUniqueId(value);
    setChildPositionUniqueIds([]);
  }

  function toggleChild(uniqueId: string) {
    setChildPositionUniqueIds((prev) =>
      prev.includes(uniqueId)
        ? prev.filter((id) => id !== uniqueId)
        : [...prev, uniqueId],
    );
  }

  function parseSeatingPosition(): number {
    const parsed = Number(seatingPosition);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const isDetailsValid = jobTitle.trim() !== "" && departmentUniqueId !== "";
  const isSeatingValid =
    seatingPosition.trim() !== "" && Number.isFinite(Number(seatingPosition));
  const isValid = isDetailsValid && isSeatingValid;

  function validateStep(step: number): boolean {
    switch (step) {
      case 1:
        return isDetailsValid;
      case 2:
        return true;
      case 3:
        return isSeatingValid;
      default:
        return false;
    }
  }

  function toInsertDto(): InsertPositionDto {
    return {
      jobTitle: jobTitle.trim(),
      departmentUniqueId,
      subDepartmentUniqueId: subDepartmentUniqueId || null,
      seatingPosition: parseSeatingPosition(),
      reportToPositionUniqueId: reportToPositionUniqueId || null,
      childPositionUniqueIds: reportToPositionUniqueId
        ? childPositionUniqueIds
        : [],
    };
  }

  function toUpdateDto(): UpdatePositionDto {
    return {
      jobTitle: jobTitle.trim(),
      departmentUniqueId,
      subDepartmentUniqueId: subDepartmentUniqueId || null,
      seatingPosition: parseSeatingPosition(),
    };
  }

  return {
    jobTitle,
    setJobTitle,
    departmentUniqueId,
    handleDepartmentChange,
    subDepartmentUniqueId,
    setSubDepartmentUniqueId,
    reportToPositionUniqueId,
    handleParentChange,
    childPositionUniqueIds,
    toggleChild,
    seatingPosition,
    setSeatingPosition,
    isValid,
    validateStep,
    toInsertDto,
    toUpdateDto,
  };
}
