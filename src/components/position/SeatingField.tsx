import type { ReactNode } from "react";
import Field from "../ui/Field";
import TextInput from "../ui/TextInput";

interface SeatingFieldProps {
  value: string;
  onChange: (value: string) => void;
  hint?: ReactNode;
}

export default function SeatingField({
  value,
  onChange,
  hint,
}: SeatingFieldProps) {
  return (
    <Field htmlFor="seatingPosition" label="Seating position" required hint={hint}>
      <TextInput
        type="number"
        id="seatingPosition"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </Field>
  );
}
