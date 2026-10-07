import dagre from "@dagrejs/dagre";
import type { Edge, Node } from "@xyflow/react";
import type { Employee, Position } from "../types/employee";

export const NODE_WIDTH = 260;
export const NODE_HEIGHT = 100;

export type EmployeeNodeData = {
  employee: Employee;
  jobTitle?: string;
  hasChildren?: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
  onToggle?: () => void;
  onSelect?: () => void;
  [key: string]: unknown;
};

export type ChildrenMap = Map<string, string[]>;
export type NodeId = string;

export function buildGraph(
  employees: Employee[],
  positions: Position[],
): {
  nodes: Node<EmployeeNodeData>[];
  edges: Edge[];
} {
  const positionById = new Map(positions.map((p) => [p.uniqueId, p]));

  const nodes: Node<EmployeeNodeData>[] = employees.map((employee) => {
    const position = employee.positionUniqueId
      ? positionById.get(employee.positionUniqueId)
      : undefined;
    return {
      id: employee.uniqueId,
      type: "employee",
      position: { x: 0, y: 0 },
      data: {
        employee,
        jobTitle: position?.jobTitle,
      },
    };
  });

  const employeesByPositionId = new Map<string, Employee[]>();

  for (const employee of employees) {
    if (employee.positionUniqueId) {
      const existing = employeesByPositionId.get(employee.positionUniqueId) ?? [];
      existing.push(employee);
      employeesByPositionId.set(employee.positionUniqueId, existing);
    }
  }

  const edges: Edge[] = [];

  for (const employee of employees) {
    if (!employee.positionUniqueId) continue;

    const position = positionById.get(employee.positionUniqueId);
    if (!position || !position.reportToPositionUniqueId) continue;

    const managerEmployees = employeesByPositionId.get(position.reportToPositionUniqueId);
    if (!managerEmployees) continue;

    for (const managerEmployee of managerEmployees) {
      edges.push({
        id: `e-${managerEmployee.uniqueId}-${employee.uniqueId}`,
        source: managerEmployee.uniqueId,
        target: employee.uniqueId,
      });
    }
  }

  return { nodes, edges };
}

export function layoutGraph(
  nodes: Node<EmployeeNodeData>[],
  edges: Edge[],
): { nodes: Node<EmployeeNodeData>[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 135, ranksep: 100 });

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

export function buildChildrenMapFromEdges(
  edges: { source: NodeId; target: NodeId }[],
): ChildrenMap {
  const childrenMap: ChildrenMap = new Map();
  for (const edge of edges) {
    const existingChildren = childrenMap.get(edge.source) ?? [];
    existingChildren.push(edge.target);
    childrenMap.set(edge.source, existingChildren);
  }
  return childrenMap;
}

export function getDirectChildIds(
  nodeId: NodeId,
  childrenMap: ChildrenMap,
): NodeId[] {
  return childrenMap.get(nodeId) ?? [];
}

export function getAllDescendantIds(
  nodeId: NodeId,
  childrenMap: ChildrenMap,
): Set<NodeId> {
  const descendants: Set<NodeId> = new Set();
  const queue: NodeId[] = [nodeId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const childIds = childrenMap.get(currentId) ?? [];

    for (const childId of childIds) {
      if (!descendants.has(childId)) {
        descendants.add(childId);
        queue.push(childId);
      }
    }
  }

  return descendants;
}

export function getHiddenNodeIds(
  collapsedNodeIds: Set<NodeId>,
  childrenMap: ChildrenMap,
): Set<NodeId> {
  const hiddenNodeIds: Set<NodeId> = new Set();

  for (const collapsedId of collapsedNodeIds) {
    const descendants = getAllDescendantIds(collapsedId, childrenMap);
    for (const descendantId of descendants) {
      hiddenNodeIds.add(descendantId);
    }
  }

  return hiddenNodeIds;
}

export function getRootNodeIds(
  employees: Employee[],
  positions: Position[],
): NodeId[] {
  const positionById = new Map(positions.map((p) => [p.uniqueId, p]));
  const rootPositionIds = new Set<string>();

  for (const position of positions) {
    if (!position.reportToPositionUniqueId) {
      rootPositionIds.add(position.uniqueId);
    }
  }

  const employeeRoots: NodeId[] = [];
  const seenEmployeeIds = new Set<string>();

  for (const employee of employees) {
    if (seenEmployeeIds.has(employee.uniqueId)) continue;

    if (!employee.positionUniqueId) {
      employeeRoots.push(employee.uniqueId);
      seenEmployeeIds.add(employee.uniqueId);
      continue;
    }

    const position = positionById.get(employee.positionUniqueId);
    if (!position) {
      employeeRoots.push(employee.uniqueId);
      seenEmployeeIds.add(employee.uniqueId);
      continue;
    }

    if (rootPositionIds.has(position.uniqueId)) {
      employeeRoots.push(employee.uniqueId);
      seenEmployeeIds.add(employee.uniqueId);
    }
  }

  return employeeRoots;
}

export function getNodesToShowAsCollapsed(
  rootNodeIds: NodeId[],
  childrenMap: ChildrenMap,
): Set<NodeId> {
  const nodesToCollapse: Set<NodeId> = new Set();

  function traverseDownFromRoot(rootId: NodeId, currentDepth: number) {
    if (currentDepth >= 2) {
      nodesToCollapse.add(rootId);
      return;
    }

    const childIds = childrenMap.get(rootId) ?? [];
    for (const childId of childIds) {
      traverseDownFromRoot(childId, currentDepth + 1);
    }
  }

  for (const rootId of rootNodeIds) {
    traverseDownFromRoot(rootId, 0);
  }

  return nodesToCollapse;
}

export function filterNodesAndEdges(
  nodes: Node<EmployeeNodeData>[],
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
