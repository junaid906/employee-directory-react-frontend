import type { EmployeeFormState } from "./formState";
import type { Position } from "../../types/position";
import Field from "../ui/Field";
import SelectInput from "../ui/SelectInput";

interface PositionStepProps {
  formData: EmployeeFormState;
  positions: Position[];
  isLoadingPositions: boolean;
  error?: string | null;
  onPositionChange: (positionId: string) => void;
}

export default function PositionStep({
  formData,
  positions,
  isLoadingPositions,
  error,
  onPositionChange,
}: PositionStepProps) {
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
