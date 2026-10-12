import type { FormEvent } from "react";
import { useMemo } from "react";
import type {
  Department,
  Position,
  SubDepartment,
  UpdatePositionDto,
} from "../types/employee";
import {
  usePositionFormState,
  type PositionFormInitial,
} from "../hooks/usePositionFormState";
import DepartmentFields from "./position/DepartmentFields";
import ParentSelect from "./position/ParentSelect";
import SeatingField from "./position/SeatingField";
import Button from "./ui/Button";
import ErrorBanner from "./ui/ErrorBanner";

interface PositionFormProps {
  initial: PositionFormInitial;
  positions: Position[];
  departments: Department[];
  subDepartments: SubDepartment[];
  excludedParentIds?: Set<string>;
  submitting: boolean;
  error: string | null;
  onSubmit: (values: UpdatePositionDto) => void;
  onCancel: () => void;
}

export default function PositionForm({
  initial,
  positions,
  departments,
  subDepartments,
  excludedParentIds,
  submitting,
  error,
  onSubmit,
  onCancel,
}: PositionFormProps) {
  const form = usePositionFormState(initial);

  const parentOptions = useMemo(
    () =>
      positions.filter((position) => !excludedParentIds?.has(position.uniqueId)),
    [positions, excludedParentIds],
  );

  const isValid =
    form.jobTitle.trim() !== "" && form.departmentUniqueId !== "" && !submitting;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValid) return;
    onSubmit(form.toUpdateDto());
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <ErrorBanner>{error}</ErrorBanner>}

      <DepartmentFields
        jobTitle={form.jobTitle}
        departmentUniqueId={form.departmentUniqueId}
        subDepartmentUniqueId={form.subDepartmentUniqueId}
        departments={departments}
        subDepartments={subDepartments}
        onJobTitleChange={form.setJobTitle}
        onDepartmentChange={form.handleDepartmentChange}
        onSubDepartmentChange={form.setSubDepartmentUniqueId}
      />

      <ParentSelect
        value={form.reportToPositionUniqueId}
        options={parentOptions}
        onChange={form.handleParentChange}
      />

      <SeatingField
        value={form.seatingPosition}
        onChange={form.setSeatingPosition}
      />

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={!isValid}>
          {submitting ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
