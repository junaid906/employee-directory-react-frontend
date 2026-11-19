import type { Edge } from "@xyflow/react";
import type { Employee } from "../../types/employee";
import type { Position } from "../../types/position";
import type { NodeId, OrgChartNode } from "./types";

const ORIGIN = { x: 0, y: 0 };

function groupEmployeesByPosition(employees: Employee[]) {
  const employeesByPositionId = new Map<string, Employee[]>();
  for (const employee of employees) {
    const existing = employeesByPositionId.get(employee.positionUniqueId) ?? [];
    existing.push(employee);
    employeesByPositionId.set(employee.positionUniqueId, existing);
  }
  return employeesByPositionId;
}

function toNode(position: Position, employees: Employee[]): OrgChartNode {
  if (employees.length === 0) {
    return {
      id: position.uniqueId,
      type: "vacant",
      position: ORIGIN,
      data: { position },
    };
  }

  if (employees.length === 1) {
    return {
      id: position.uniqueId,
      type: "employee",
      position: ORIGIN,
      data: { employee: employees[0], jobTitle: position.jobTitle },
    };
  }

  return {
    id: position.uniqueId,
    type: "managerCluster",
    position: ORIGIN,
    data: { position, employees },
  };
}

export function buildGraph(
  employees: Employee[],
  positions: Position[],
): { nodes: OrgChartNode[]; edges: Edge[] } {
  const positionIds = new Set(positions.map((position) => position.uniqueId));
  const employeesByPositionId = groupEmployeesByPosition(employees);

  const nodes = positions.map((position) =>
    toNode(position, employeesByPositionId.get(position.uniqueId) ?? []),
  );

  const edges: Edge[] = positions
    .filter(
      (position) =>
        position.reportToPositionUniqueId &&
        positionIds.has(position.reportToPositionUniqueId),
    )
    .map((position) => ({
      id: `e-${position.reportToPositionUniqueId}-${position.uniqueId}`,
      source: position.reportToPositionUniqueId!,
      target: position.uniqueId,
    }));

  return { nodes, edges };
}

export function filterNodesAndEdges(
  nodes: OrgChartNode[],
  edges: Edge[],
  hiddenNodeIds: Set<NodeId>,
) {
  const visibleNodes = nodes.filter((node) => !hiddenNodeIds.has(node.id));
  const visibleNodeIds = new Set(visibleNodes.map((node) => node.id));
  const visibleEdges = edges.filter(
    (edge) =>
      visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target),
  );

  return { visibleNodes, visibleEdges };
}
