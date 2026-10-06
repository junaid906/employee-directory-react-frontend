import type { CreateEmployeeDto } from "../../api/employees";

interface Step1Props {
  formData: CreateEmployeeDto;
  onChange: (field: keyof CreateEmployeeDto, value: string) => void;
}

export default function Step1({ formData, onChange }: Step1Props) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-black">
          First Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="firstName"
          value={formData.firstName}
          onChange={(e) => onChange("firstName", e.target.value)}
          required
          className="mt-1 block w-full rounded border border-neutral-300 px-3 py-2 text-black placeholder:text-neutral-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-black">
          Last Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="lastName"
          value={formData.lastName}
          onChange={(e) => onChange("lastName", e.target.value)}
          required
          className="mt-1 block w-full rounded border border-neutral-300 px-3 py-2 text-black placeholder:text-neutral-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-black">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          required
          pattern=".+@wbwr\.io"
          title="Email must be from the @wbwr.io domain"
          className="mt-1 block w-full rounded border border-neutral-300 px-3 py-2 text-black placeholder:text-neutral-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
        <p className="mt-1 text-xs text-neutral-500">Must be from the @wbwr.io domain</p>
      </div>
    </div>
  );
}
