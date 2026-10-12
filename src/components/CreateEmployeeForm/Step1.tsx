import type { CreateEmployeeDto } from "../../api/employees";
import { COMPANY_EMAIL_DOMAIN } from "../../lib/constants";
import Field from "../ui/Field";
import TextInput from "../ui/TextInput";

interface Step1Props {
  formData: CreateEmployeeDto;
  onChange: (field: keyof CreateEmployeeDto, value: string) => void;
}

export default function Step1({ formData, onChange }: Step1Props) {
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
          pattern={`.+@${COMPANY_EMAIL_DOMAIN.replace(".", "\\.")}`}
          title={`Email must be from the @${COMPANY_EMAIL_DOMAIN} domain`}
        />
      </Field>

      <Field htmlFor="role" label="Role" hint="Assigned automatically">
        <input
          type="text"
          id="role"
          value="User"
          readOnly
          disabled
          className="mt-1 block w-full rounded border border-neutral-300 bg-neutral-100 px-3 py-2 text-neutral-500"
        />
      </Field>
    </div>
  );
}
