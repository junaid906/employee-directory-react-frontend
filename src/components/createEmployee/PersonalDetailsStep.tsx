import type { EmployeeFormField, EmployeeFormState } from "./formState";
import { COMPANY_EMAIL_DOMAIN } from "../../lib/constants";
import Field from "../ui/Field";
import TextInput from "../ui/TextInput";

interface PersonalDetailsStepProps {
  formData: EmployeeFormState;
  onChange: (field: EmployeeFormField, value: string) => void;
}

export default function PersonalDetailsStep({
  formData,
  onChange,
}: PersonalDetailsStepProps) {
  return (
    <div className="space-y-4">
      <Field htmlFor="firstName" label="First Name" required>
        <TextInput
          id="firstName"
          value={formData.firstName}
          onChange={(e) => onChange("firstName", e.target.value)}
          required
        />
      </Field>

      <Field htmlFor="lastName" label="Last Name" required>
        <TextInput
          id="lastName"
          value={formData.lastName}
          onChange={(e) => onChange("lastName", e.target.value)}
          required
        />
      </Field>

      <Field
        htmlFor="email"
        label="Email"
        required
        hint={<>Must be from the @{COMPANY_EMAIL_DOMAIN} domain</>}
      >
        <TextInput
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          required
        />
      </Field>

      <Field htmlFor="role" label="Role" hint="Assigned automatically">
        <TextInput id="role" value="User" readOnly disabled />
      </Field>
    </div>
  );
}
