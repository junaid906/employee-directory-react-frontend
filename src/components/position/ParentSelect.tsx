import type { ReactNode } from "react";
import type { Position } from "../../types/employee";
import Field from "../ui/Field";
import SelectInput from "../ui/SelectInput";

interface ParentSelectProps {
  value: string;
  options: Position[];
  onChange: (value: string) => void;
  hint?: ReactNode;
}

export default function ParentSelect({
  value,
  options,
  onChange,
  hint,
}: ParentSelectProps) {
  return (
    <Field
      htmlFor="reportToPositionUniqueId"
      label="Who does this position report to?"
      hint={hint}
    >
      <SelectInput
        id="reportToPositionUniqueId"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">None (top level)</option>
        {options.map((position) => (
          <option key={position.uniqueId} value={position.uniqueId}>
            {position.jobTitle}
          </option>
        ))}
      </SelectInput>
    </Field>
  );
}
