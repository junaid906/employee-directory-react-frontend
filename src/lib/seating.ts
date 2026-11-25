import type { CSSProperties } from "react";
import firstFloorSrc from "../assets/1st-floor.svg";
import loftSrc from "../assets/loft.svg";

export type FloorId = "floor1" | "loft";

export interface FloorConfig {
  label: string;
  src: string;
  viewBox: { x: number; y: number; width: number; height: number };
}

export const FLOORS: Record<FloorId, FloorConfig> = {
  floor1: {
    label: "First floor",
    src: firstFloorSrc,
    viewBox: { x: 60, y: 10, width: 1900, height: 1340 },
  },
  loft: {
    label: "Loft",
    src: loftSrc,
    viewBox: { x: 190, y: 55, width: 1570, height: 1200 },
  },
};

export interface SeatArea {
  floor: FloorId;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const SEATING_MAP: Record<number, SeatArea> = {
  1: { floor: "floor1", x: 95, y: 760, width: 515, height: 545 },
  2: { floor: "floor1", x: 1235, y: 990, width: 660, height: 305 },
  3: { floor: "floor1", x: 385, y: 555, width: 170, height: 110 },
  4: { floor: "floor1", x: 1125, y: 430, width: 795, height: 505 },
  5: { floor: "floor1", x: 1265, y: 115, width: 655, height: 255 },
  10: { floor: "loft", x: 1200, y: 790, width: 390, height: 425 },
  11: { floor: "loft", x: 445, y: 700, width: 165, height: 220 },
  12: { floor: "loft", x: 218, y: 168, width: 380, height: 390 },
  13: { floor: "loft", x: 905, y: 170, width: 820, height: 610 },
};

export function seatAreaStyle(seat: SeatArea): CSSProperties {
  const { viewBox } = FLOORS[seat.floor];
  return {
    left: `${((seat.x - viewBox.x) / viewBox.width) * 100}%`,
    top: `${((seat.y - viewBox.y) / viewBox.height) * 100}%`,
    width: `${(seat.width / viewBox.width) * 100}%`,
    height: `${(seat.height / viewBox.height) * 100}%`,
  };
}

export function seatLabel(value: number): string | null {
  const seat = SEATING_MAP[value];
  return seat ? `${FLOORS[seat.floor].label} · Zone ${value}` : null;
}
