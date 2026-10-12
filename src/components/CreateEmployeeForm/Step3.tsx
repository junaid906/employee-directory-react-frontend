import type { CreateEmployeeDto } from "../../api/employees";
import Field from "../ui/Field";
import TextInput from "../ui/TextInput";

interface Step3Props {
  formData: CreateEmployeeDto;
  onChange: (field: keyof CreateEmployeeDto, value: string) => void;
}

export default function Step3({ formData, onChange }: Step3Props) {
  return (
    <div className="space-y-4">
      <Field
        htmlFor="avatarUrl"
        label="Avatar URL"
        hint="Optional URL to employee's avatar image"
      >
        <TextInput
          type="url"
          id="avatarUrl"
          value={formData.avatarUrl ?? ""}
          onChange={(e) => onChange("avatarUrl", e.target.value)}
          placeholder="https://example.com/avatar.jpg"
        />
      </Field>
    </div>
  );
}
