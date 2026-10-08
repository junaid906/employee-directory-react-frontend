import dagre from "@dagrejs/dagre";
import type { Edge, Node } from "@xyflow/react";
import type { Employee, Position } from "../types/employee";

export const NODE_WIDTH = 180;
export const NODE_HEIGHT = 180;
export const CLUSTER_CARD_WIDTH = 180;
export const CLUSTER_CARD_GAP = 4;
export const CLUSTER_PADDING = 12;
export const CLUSTER_BORDER = 2;
export const CLUSTER_HEADER_HEIGHT = 56;

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

export type ManagerClusterNodeData = {
  position: Position;
  employees: Employee[];
  hasChildren?: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
  onToggle?: () => void;
  onSelect?: () => void;
  [key: string]: unknown;
};

export type VacantNodeData = {
  position: Position;
  hasChildren?: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
  onToggle?: () => void;
  onSelect?: () => void;
  [key: string]: unknown;
};

export type ChildrenMap = Map<string, string[]>;
export type NodeId = string;

export type OrgChartNode = Node<
  EmployeeNodeData | ManagerClusterNodeData | VacantNodeData
>;

export function getClusterWidth(employeeCount: number): number {
  const count = Math.max(employeeCount, 1);
  const content =
    count * CLUSTER_CARD_WIDTH + (count - 1) * CLUSTER_CARD_GAP;
  return content + (CLUSTER_PADDING + CLUSTER_BORDER) * 2;
}

function getNodeWidth(node: OrgChartNode): number {
  if (node.type === "managerCluster") {
    return getClusterWidth(
      (node.data as ManagerClusterNodeData).employees.length,
    );
  }
  return NODE_WIDTH;
}

function getNodeHeight(node: OrgChartNode): number {
  if (node.type === "managerCluster") {
    return NODE_HEIGHT + CLUSTER_HEADER_HEIGHT;
  }
  return NODE_HEIGHT;
}

export function buildGraph(
  employees: Employee[],
  positions: Position[],
): {
  nodes: OrgChartNode[];
  edges: Edge[];
} {
  const positionById = new Map(positions.map((p) => [p.uniqueId, p]));

  const employeesByPositionId = new Map<string, Employee[]>();
  for (const employee of employees) {
    const existing = employeesByPositionId.get(employee.positionUniqueId) ?? [];
    existing.push(employee);
    employeesByPositionId.set(employee.positionUniqueId, existing);
  }

  const nodes: OrgChartNode[] = positions.map((position) => {
    const positionEmployees =
      employeesByPositionId.get(position.uniqueId) ?? [];

    if (positionEmployees.length === 0) {
      return {
        id: position.uniqueId,
        type: "vacant",
        position: { x: 0, y: 0 },
        data: {
          position,
        } as VacantNodeData,
      };
    }

    if (positionEmployees.length === 1) {
      return {
        id: position.uniqueId,
        type: "employee",
        position: { x: 0, y: 0 },
        data: {
          employee: positionEmployees[0],
          jobTitle: position.jobTitle,
        } as EmployeeNodeData,
      };
    }

    return {
      id: position.uniqueId,
      type: "managerCluster",
      position: { x: 0, y: 0 },
      data: {
        position,
        employees: positionEmployees,
      } as ManagerClusterNodeData,
    };
  });

  const edges: Edge[] = [];
  for (const position of positions) {
    if (!position.reportToPositionUniqueId) continue;
    if (!positionById.has(position.reportToPositionUniqueId)) continue;

    edges.push({
      id: `e-${position.reportToPositionUniqueId}-${position.uniqueId}`,
      source: position.reportToPositionUniqueId,
      target: position.uniqueId,
    });
  }

  return { nodes, edges };
}

export function layoutGraph(
  nodes: OrgChartNode[],
  edges: Edge[],
): { nodes: OrgChartNode[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 40, ranksep: 300 });

  for (const node of nodes) {
    g.setNode(node.id, {
      width: getNodeWidth(node),
      height: getNodeHeight(node),
    });
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
        x: pos.x - getNodeWidth(node) / 2,
        y: pos.y - getNodeHeight(node) / 2,
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

export function getRootNodeIds(positions: Position[]): NodeId[] {
  const rootPositionIds: NodeId[] = [];

  for (const position of positions) {
    if (!position.reportToPositionUniqueId) {
      rootPositionIds.push(position.uniqueId);
    }
  }

  return rootPositionIds;
}

export function getAncestorIds(
  nodeId: NodeId,
  childToParentMap: Map<NodeId, NodeId>,
): NodeId[] {
  const ancestors: NodeId[] = [];
  let parentId = childToParentMap.get(nodeId);

  while (parentId) {
    ancestors.push(parentId);
    parentId = childToParentMap.get(parentId);
  }

  return ancestors;
}

export function buildChildToParentMap(
  childrenMap: ChildrenMap,
): Map<NodeId, NodeId> {
  const childToParentMap = new Map<NodeId, NodeId>();
  for (const [parentId, childIds] of childrenMap) {
    for (const childId of childIds) {
      childToParentMap.set(childId, parentId);
    }
  }
  return childToParentMap;
}

export function getNextCollapsedNodeIds(
  current: Set<NodeId>,
  toggledId: NodeId,
  childToParentMap: Map<NodeId, NodeId>,
  childrenMap: ChildrenMap,
): Set<NodeId> {
  const next = new Set(current);

  if (next.has(toggledId)) {
    const parentId = childToParentMap.get(toggledId);
    if (parentId) {
      for (const siblingId of childrenMap.get(parentId) ?? []) {
        if (siblingId !== toggledId) {
          next.add(siblingId);
        }
      }
    }
    next.delete(toggledId);
  } else {
    next.add(toggledId);
  }

  return next;
}

export function getNodesToShowAsCollapsed(
  rootNodeIds: NodeId[],
  childrenMap: ChildrenMap,
): Set<NodeId> {
  const nodesToCollapse: Set<NodeId> = new Set();

  for (const rootId of rootNodeIds) {
    for (const descendantId of getAllDescendantIds(rootId, childrenMap)) {
      nodesToCollapse.add(descendantId);
    }
  }

  return nodesToCollapse;
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
