import type { Position } from "../../types/employee";
import { labelClasses } from "../ui/formClasses";

interface ChildPositionPickerProps {
  positions: Position[];
  parentUniqueId: string;
  selectedIds: string[];
  onToggle: (uniqueId: string) => void;
}

export default function ChildPositionPicker({
  positions,
  parentUniqueId,
  selectedIds,
  onToggle,
}: ChildPositionPickerProps) {
  if (!parentUniqueId) return null;

  const childCandidates = positions.filter(
    (position) => position.reportToPositionUniqueId === parentUniqueId,
  );

  return (
    <fieldset>
      <legend className={labelClasses}>
        Which positions should now report to the new position?
      </legend>
      {childCandidates.length === 0 ? (
        <p className="mt-1 text-sm text-neutral-500">
          This position has no direct children to move.
        </p>
      ) : (
        <div className="mt-2 space-y-2">
          {childCandidates.map((position) => (
            <label
              key={position.uniqueId}
              className="flex items-center gap-2 text-sm text-black"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(position.uniqueId)}
                onChange={() => onToggle(position.uniqueId)}
                className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black"
              />
              {position.jobTitle}
            </label>
          ))}
        </div>
      )}
    </fieldset>
  );
}
