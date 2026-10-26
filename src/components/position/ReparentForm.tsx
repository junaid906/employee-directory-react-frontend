import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { Position } from "../../types/employee";
import {
  buildChildrenMapFromPositions,
  getAllDescendantIds,
} from "../../lib/orgChart";
import Field from "../ui/Field";
import SelectInput from "../ui/SelectInput";
import Button from "../ui/Button";
import ErrorBanner from "../ui/ErrorBanner";
import { labelClasses } from "../ui/formClasses";

interface ReparentFormProps {
  positions: Position[];
  initialMoverIds?: string[];
  submitting: boolean;
  error: string | null;
  onSubmit: (
    targetParentUniqueId: string,
    childPositionUniqueIds: string[],
  ) => void;
}

export default function ReparentForm({
  positions,
  initialMoverIds = [],
  submitting,
  error,
  onSubmit,
}: ReparentFormProps) {
  const [moverIds, setMoverIds] = useState<string[]>(initialMoverIds);
  const [targetParentUniqueId, setTargetParentUniqueId] = useState("");

  const childrenMap = useMemo(
    () => buildChildrenMapFromPositions(positions),
    [positions],
  );

  const invalidParentIds = useMemo(() => {
    const invalid = new Set<string>();
    for (const moverId of moverIds) {
      invalid.add(moverId);
      for (const descendantId of getAllDescendantIds(moverId, childrenMap)) {
        invalid.add(descendantId);
      }
    }
    return invalid;
  }, [moverIds, childrenMap]);

  const parentOptions = useMemo(
    () =>
      positions.filter((position) => !invalidParentIds.has(position.uniqueId)),
    [positions, invalidParentIds],
  );

  const effectiveTargetParentUniqueId = parentOptions.some(
    (position) => position.uniqueId === targetParentUniqueId,
  )
    ? targetParentUniqueId
    : "";

  function toggleMover(uniqueId: string) {
    setMoverIds((prev) =>
      prev.includes(uniqueId)
        ? prev.filter((id) => id !== uniqueId)
        : [...prev, uniqueId],
    );
  }

  const isValid =
    moverIds.length > 0 &&
    effectiveTargetParentUniqueId !== "" &&
    !submitting;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValid) return;
    onSubmit(effectiveTargetParentUniqueId, moverIds);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <ErrorBanner>{error}</ErrorBanner>}

      <Field
        htmlFor="targetParentUniqueId"
        label="Move under"
        required
        hint="Choose the new parent. A position and its descendants can't become parents of the move."
      >
        <SelectInput
          id="targetParentUniqueId"
          value={effectiveTargetParentUniqueId}
          onChange={(e) => setTargetParentUniqueId(e.target.value)}
          required
        >
          <option value="">Select a parent</option>
          {parentOptions.map((position) => (
            <option key={position.uniqueId} value={position.uniqueId}>
              {position.jobTitle}
            </option>
          ))}
        </SelectInput>
      </Field>

      <fieldset>
        <legend className={labelClasses}>Positions to move</legend>
        <div className="mt-2 max-h-56 space-y-2 overflow-y-auto rounded border border-neutral-200 p-3">
          {positions.map((position) => (
            <label
              key={position.uniqueId}
              className="flex items-center gap-2 text-sm text-black"
            >
              <input
                type="checkbox"
                checked={moverIds.includes(position.uniqueId)}
                onChange={() => toggleMover(position.uniqueId)}
                className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black"
              />
              {position.jobTitle}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="submit" disabled={!isValid}>
          {submitting ? "Moving…" : "Move"}
        </Button>
      </div>
    </form>
  );
}
