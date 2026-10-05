import dagre from "@dagrejs/dagre";
import type { Edge, Node } from "@xyflow/react";
import type { Employee } from "../types/employee";

export const NODE_WIDTH = 260;
export const NODE_HEIGHT = 100;

export type EmployeeNodeData = {
  employee: Employee;
  [key: string]: unknown;
};

export function buildGraph(employees: Employee[]): {
  nodes: Node<EmployeeNodeData>[];
  edges: Edge[];
} {
  const nodes: Node<EmployeeNodeData>[] = employees.map((employee) => ({
    id: employee.uniqueId,
    type: "employee",
    position: { x: 0, y: 0 },
    data: { employee },
  }));

  const edges: Edge[] = employees
    .filter((e) => e.reportingToUniqueId != null)
    .map((e) => ({
      id: `e-${e.reportingToUniqueId}-${e.uniqueId}`,
      source: e.reportingToUniqueId as string,
      target: e.uniqueId,
    }));

  return { nodes, edges };
}

export function layoutGraph(
  nodes: Node<EmployeeNodeData>[],
  edges: Edge[],
): { nodes: Node<EmployeeNodeData>[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 40, ranksep: 64 });

  for (const node of nodes) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }
  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  const laidOutNodes = nodes.map((node) => {
    const pos = g.node(node.id);
    return {
      ...node,
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - NODE_HEIGHT / 2,
      },
    };
  });

  return { nodes: laidOutNodes, edges };
}
