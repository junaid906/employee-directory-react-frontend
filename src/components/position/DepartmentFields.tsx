import type { Department, SubDepartment } from "../../types/employee";
import Field from "../ui/Field";
import SelectInput from "../ui/SelectInput";
import TextInput from "../ui/TextInput";

interface DepartmentFieldsProps {
  jobTitle: string;
  departmentUniqueId: string;
  subDepartmentUniqueId: string;
  departments: Department[];
  subDepartments: SubDepartment[];
  onJobTitleChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onSubDepartmentChange: (value: string) => void;
}

export default function DepartmentFields({
  jobTitle,
  departmentUniqueId,
  subDepartmentUniqueId,
  departments,
  subDepartments,
  onJobTitleChange,
  onDepartmentChange,
  onSubDepartmentChange,
}: DepartmentFieldsProps) {
  const visibleSubDepartments = departmentUniqueId
    ? subDepartments.filter(
        (subDepartment) =>
          subDepartment.departmentUniqueId === departmentUniqueId,
      )
    : subDepartments;

  return (
    <div className="space-y-4">
      <Field htmlFor="jobTitle" label="Job title" required>
        <TextInput
          id="jobTitle"
          value={jobTitle}
          onChange={(e) => onJobTitleChange(e.target.value)}
          required
        />
      </Field>

      <Field htmlFor="departmentUniqueId" label="Department" required>
        <SelectInput
          id="departmentUniqueId"
          value={departmentUniqueId}
          onChange={(e) => onDepartmentChange(e.target.value)}
        >
          <option value="">Select a department</option>
          {departments.map((department) => (
            <option key={department.uniqueId} value={department.uniqueId}>
              {department.departmentName}
            </option>
          ))}
        </SelectInput>
      </Field>

      <Field htmlFor="subDepartmentUniqueId" label="Subdepartment">
        <SelectInput
          id="subDepartmentUniqueId"
          value={subDepartmentUniqueId}
          onChange={(e) => onSubDepartmentChange(e.target.value)}
        >
          <option value="">None</option>
          {visibleSubDepartments.map((subDepartment) => (
            <option key={subDepartment.uniqueId} value={subDepartment.uniqueId}>
              {subDepartment.subDepartmentName}
            </option>
          ))}
        </SelectInput>
      </Field>
    </div>
  );
}
