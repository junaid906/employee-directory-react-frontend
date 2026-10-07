import type { CreateEmployeeDto } from "../../api/employees";

interface Step3Props {
  formData: CreateEmployeeDto;
  onChange: (field: keyof CreateEmployeeDto, value: string) => void;
}

export default function Step3({ formData, onChange }: Step3Props) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="avatarUrl" className="block text-sm font-medium text-black">
          Avatar URL
        </label>
        <input
          type="url"
          id="avatarUrl"
          value={formData.avatarUrl ?? ""}
          onChange={(e) => onChange("avatarUrl", e.target.value)}
          placeholder="https://example.com/avatar.jpg"
          className="mt-1 block w-full rounded border border-neutral-300 px-3 py-2 text-black placeholder:text-neutral-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
        <p className="mt-1 text-xs text-neutral-500">Optional URL to employee's avatar image</p>
      </div>
    </div>
  );
}
