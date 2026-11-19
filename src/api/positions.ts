import { apiClient, stripEmptyFields } from "./client";
import type {
  InsertPositionDto,
  Position,
  ReparentPositionsDto,
  UpdatePositionDto,
} from "../types/position";

export async function getPositions(): Promise<Position[]> {
  const { data } = await apiClient.get<Position[]>("/positions");
  return data;
}

export async function getPosition(id: string): Promise<Position> {
  const { data } = await apiClient.get<Position>(`/positions/${id}`);
  return data;
}

export async function insertPosition(
  data: InsertPositionDto,
): Promise<Position> {
  const { data: position } = await apiClient.post<Position>(
    "/positions/insert-between",
    data,
  );
  return position;
}

export async function updatePosition(
  uniqueId: string,
  data: UpdatePositionDto,
): Promise<Position> {
  const { data: position } = await apiClient.put<Position>(
    `/positions/${uniqueId}`,
    stripEmptyFields({ ...data }),
  );
  return position;
}

export async function reparentPositions(
  data: ReparentPositionsDto,
): Promise<void> {
  await apiClient.post("/positions/reparent", data);
}
