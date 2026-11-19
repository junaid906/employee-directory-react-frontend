import type { FormEvent } from "react";
import type { Department, SubDepartment } from "../types/department";
import type { UpdatePositionDto } from "../types/position";
import {
  usePositionFormState,
  type PositionFormInitial,
} from "../hooks/usePositionFormState";
import DepartmentFields from "./position/DepartmentFields";
import SeatingField from "./position/SeatingField";
import Button from "./ui/Button";
import ErrorBanner from "./ui/ErrorBanner";

interface PositionFormProps {
  initial: PositionFormInitial;
  departments: Department[];
  subDepartments: SubDepartment[];
  submitting: boolean;
  error: string | null;
  onSubmit: (values: UpdatePositionDto) => void;
  onCancel: () => void;
}

export default function PositionForm({
  initial,
  departments,
  subDepartments,
  submitting,
  error,
  onSubmit,
  onCancel,
}: PositionFormProps) {
  const form = usePositionFormState(initial);

  const canSubmit = form.isValid && !submitting;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
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

      <SeatingField
        value={form.seatingPosition}
        onChange={form.setSeatingPosition}
      />

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit}>
          {submitting ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
