import { FLOORS, type SeatArea } from "../lib/seating";

interface FloorPlanProps {
  seat: SeatArea;
}

export default function FloorPlan({ seat }: FloorPlanProps) {
  const config = FLOORS[seat.floor];
  const { viewBox } = config;

  const overlayStyle = {
    left: `${((seat.x - viewBox.x) / viewBox.width) * 100}%`,
    top: `${((seat.y - viewBox.y) / viewBox.height) * 100}%`,
    width: `${(seat.width / viewBox.width) * 100}%`,
    height: `${(seat.height / viewBox.height) * 100}%`,
  };

  return (
    <div className="w-full max-w-xs">
      <h3 className="text-sm font-semibold text-black">{config.label}</h3>
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
          style={overlayStyle}
        />
      </div>
    </div>
  );
}
