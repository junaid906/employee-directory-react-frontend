import type { EmployeeFormField, EmployeeFormState } from "./formState";
import Field from "../ui/Field";
import TextInput from "../ui/TextInput";

interface AvatarStepProps {
  formData: EmployeeFormState;
  onChange: (field: EmployeeFormField, value: string) => void;
}

export default function AvatarStep({ formData, onChange }: AvatarStepProps) {
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
          value={formData.avatarUrl}
          onChange={(e) => onChange("avatarUrl", e.target.value)}
          placeholder="https://example.com/avatar.jpg"
        />
      </Field>
    </div>
  );
}
