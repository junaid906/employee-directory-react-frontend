import { useState } from "react";
import { cx } from "../../lib/cx";
import {
  FLOORS,
  SEATING_MAP,
  seatAreaStyle,
  seatLabel,
  type FloorId,
} from "../../lib/seating";
import { buttonClasses } from "../ui/buttonClasses";
import { labelClasses } from "../ui/formClasses";

interface SeatingFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const FLOOR_IDS = Object.keys(FLOORS) as FloorId[];

export default function SeatingField({ value, onChange }: SeatingFieldProps) {
  const selected = value === "" ? null : Number(value);
  const [activeFloor, setActiveFloor] = useState<FloorId>(
    (selected !== null && SEATING_MAP[selected]?.floor) || FLOOR_IDS[0],
  );

  const floor = FLOORS[activeFloor];
  const zones = Object.entries(SEATING_MAP)
    .map(([id, seat]) => ({ id: Number(id), seat }))
    .filter(({ seat }) => seat.floor === activeFloor);
  const selectedLabel = selected !== null ? seatLabel(selected) : null;

  return (
    <div>
      <p id="seatingPositionLabel" className={labelClasses}>
        Seating position<span className="text-red-500"> *</span>
      </p>

      <div className="mt-2 flex gap-2">
        {FLOOR_IDS.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={id === activeFloor}
            onClick={() => setActiveFloor(id)}
            className={buttonClasses(id === activeFloor ? "primary" : "secondary")}
          >
            {FLOORS[id].label}
          </button>
        ))}
      </div>

      <div
        role="group"
        aria-labelledby="seatingPositionLabel"
        className="relative mt-3 w-full overflow-hidden rounded border border-neutral-300"
      >
        <img
          src={floor.src}
          alt={`${floor.label} floor plan`}
          className="block w-full"
          style={{
            aspectRatio: `${floor.viewBox.width} / ${floor.viewBox.height}`,
          }}
        />
        {zones.map(({ id, seat }) => {
          const isSelected = id === selected;
          return (
            <button
              key={id}
              type="button"
              aria-label={`Zone ${id}`}
              aria-pressed={isSelected}
              onClick={() => onChange(String(id))}
              style={seatAreaStyle(seat)}
              className={cx(
                "absolute flex cursor-pointer items-center justify-center rounded-md border-2 text-xs font-semibold transition-colors",
                isSelected
                  ? "border-red-500 bg-red-500/25 text-red-700"
                  : "border-neutral-500 bg-neutral-500/20 text-neutral-700 hover:bg-neutral-500/40",
              )}
            >
              {id}
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-xs text-neutral-500">
        {selectedLabel
          ? `Selected: ${selectedLabel}`
          : "Click a zone on the map to choose a seat."}
      </p>
    </div>
  );
}
