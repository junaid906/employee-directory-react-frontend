import dagre from "@dagrejs/dagre";
import type { Edge, Node } from "@xyflow/react";
import type { Employee } from "../types/employee";

export const NODE_WIDTH = 260;
export const NODE_HEIGHT = 100;

export type EmployeeNodeData = {
  employee: Employee;
  hasChildren?: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
  onToggle?: () => void;
  onSelect?: () => void;
  [key: string]: unknown;
};

export type ChildrenMap = Map<string, string[]>;
export type NodeId = string;

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

export function getRootNodeIds(employees: Employee[]): NodeId[] {
  return employees
    .filter((employee) => employee.reportingToUniqueId === null)
    .map((employee) => employee.uniqueId);
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
