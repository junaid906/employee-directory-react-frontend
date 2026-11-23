import { FLOORS, seatAreaStyle, type SeatArea } from "../lib/seating";

interface FloorPlanProps {
  seat: SeatArea;
}

export default function FloorPlan({ seat }: FloorPlanProps) {
  const config = FLOORS[seat.floor];
  const { viewBox } = config;

  return (
    <div className="w-full max-w-xs">
      <h3 className="font-sans text-sm font-semibold text-black">{config.label}</h3>
      <div className="relative mt-2 overflow-hidden rounded border border-neutral-300">
        <img
          src={config.src}
          alt={`${config.label} floor plan`}
          className="block w-full"
          style={{ aspectRatio: `${viewBox.width} / ${viewBox.height}` }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-md border-2 border-red-500 bg-red-500/25"
          style={seatAreaStyle(seat)}
        />
      </div>
    </div>
  );
}
