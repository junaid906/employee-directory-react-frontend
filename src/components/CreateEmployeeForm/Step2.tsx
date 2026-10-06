import type { CreateEmployeeDto, ManagerSummary } from "../../api/employees";

interface Step2Props {
  formData: CreateEmployeeDto;
  managers: ManagerSummary[];
  isLoadingManagers: boolean;
  onChange: (field: keyof CreateEmployeeDto, value: string) => void;
  onManagerChange: (managerId: string | null) => void;
}

export default function Step2({
  formData,
  managers,
  isLoadingManagers,
  onChange,
  onManagerChange,
}: Step2Props) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="department" className="block text-sm font-medium text-black">
          Department <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="department"
          value={formData.department}
          onChange={(e) => onChange("department", e.target.value)}
          required
          className="mt-1 block w-full rounded border border-neutral-300 px-3 py-2 text-black placeholder:text-neutral-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

      <div>
        <label htmlFor="subDepartment" className="block text-sm font-medium text-black">
          Sub-Department <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="subDepartment"
          value={formData.subDepartment}
          onChange={(e) => onChange("subDepartment", e.target.value)}
          required
          className="mt-1 block w-full rounded border border-neutral-300 px-3 py-2 text-black placeholder:text-neutral-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

      <div>
        <label htmlFor="jobTitle" className="block text-sm font-medium text-black">
          Job Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="jobTitle"
          value={formData.jobTitle}
          onChange={(e) => onChange("jobTitle", e.target.value)}
          required
          className="mt-1 block w-full rounded border border-neutral-300 px-3 py-2 text-black placeholder:text-neutral-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

      <div>
        <label htmlFor="reportingToUniqueId" className="block text-sm font-medium text-black">
          Reports To
        </label>
        {isLoadingManagers ? (
          <p className="mt-1 text-sm text-neutral-500">Loading managers...</p>
        ) : (
          <select
            id="reportingToUniqueId"
            value={formData.reportingToUniqueId ?? ""}
            onChange={(e) => onManagerChange(e.target.value || null)}
            className="mt-1 block w-full rounded border border-neutral-300 px-3 py-2 text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="">Select a manager</option>
            {managers.map((manager) => (
              <option key={manager.uniqueId} value={manager.uniqueId}>
                {manager.firstName} {manager.lastName}
              </option>
            ))}
          </select>
        )}
        <p className="mt-1 text-xs text-neutral-500">Leave empty if this employee has no manager</p>
      </div>
    </div>
  );
}
