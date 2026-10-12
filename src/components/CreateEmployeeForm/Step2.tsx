import type { CreateEmployeeDto } from "../../api/employees";
import type { Position } from "../../types/employee";
import Field from "../ui/Field";
import SelectInput from "../ui/SelectInput";

interface Step2Props {
  formData: CreateEmployeeDto;
  positions: Position[];
  isLoadingPositions: boolean;
  error?: string | null;
  onPositionChange: (positionId: string) => void;
}

export default function Step2({
  formData,
  positions,
  isLoadingPositions,
  error,
  onPositionChange,
}: Step2Props) {
  return (
    <div className="space-y-4">
      <Field
        htmlFor="positionUniqueId"
        label="Position"
        hint="Select a position for this employee"
      >
        {isLoadingPositions ? (
          <p className="mt-1 text-sm text-neutral-500">Loading positions...</p>
        ) : error ? (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        ) : (
          <SelectInput
            id="positionUniqueId"
            value={formData.positionUniqueId}
            onChange={(e) => onPositionChange(e.target.value)}
          >
            <option value="">Select a position</option>
            {positions.map((position) => (
              <option key={position.uniqueId} value={position.uniqueId}>
                {position.jobTitle}
              </option>
            ))}
          </SelectInput>
        )}
      </Field>
    </div>
  );
}
