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
  1: { floor: "floor1", x: 880, y: 230, width: 340, height: 240 },
  2: { floor: "floor1", x: 1380, y: 500, width: 360, height: 360 },
  3: { floor: "floor1", x: 1250, y: 1060, width: 380, height: 260 },
  11: { floor: "loft", x: 200, y: 150, width: 400, height: 300 },
  12: { floor: "loft", x: 1000, y: 480, width: 660, height: 160 },
  13: { floor: "loft", x: 1300, y: 880, width: 330, height: 360 },
};
