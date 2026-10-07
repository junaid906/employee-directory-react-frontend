import type { CreateEmployeeDto, Position } from "../../api/employees";

interface Step2Props {
  formData: CreateEmployeeDto;
  positions: Position[];
  isLoadingPositions: boolean;
  onPositionChange: (positionId: string | null) => void;
}

export default function Step2({
  formData,
  positions,
  isLoadingPositions,
  onPositionChange,
}: Step2Props) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="positionUniqueId" className="block text-sm font-medium text-black">
          Position
        </label>
        {isLoadingPositions ? (
          <p className="mt-1 text-sm text-neutral-500">Loading positions...</p>
        ) : (
          <select
            id="positionUniqueId"
            value={formData.positionUniqueId ?? ""}
            onChange={(e) => onPositionChange(e.target.value || null)}
            className="mt-1 block w-full rounded border border-neutral-300 px-3 py-2 text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="">Select a position</option>
            {positions.map((position) => (
              <option key={position.uniqueId} value={position.uniqueId}>
                {position.jobTitle}
              </option>
            ))}
          </select>
        )}
        <p className="mt-1 text-xs text-neutral-500">Leave empty if this employee has no position yet</p>
      </div>
    </div>
  );
}
