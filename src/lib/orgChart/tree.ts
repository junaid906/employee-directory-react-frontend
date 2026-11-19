import type { Position } from "../../types/position";
import type { ChildrenMap, NodeId } from "./types";

export function buildChildrenMap(positions: Position[]): ChildrenMap {
  const positionIds = new Set(positions.map((position) => position.uniqueId));
  const childrenMap: ChildrenMap = new Map();
  for (const position of positions) {
    const parentId = position.reportToPositionUniqueId;
    if (!parentId || !positionIds.has(parentId)) continue;
    const existingChildren = childrenMap.get(parentId) ?? [];
    existingChildren.push(position.uniqueId);
    childrenMap.set(parentId, existingChildren);
  }
  return childrenMap;
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

export function getRootNodeIds(positions: Position[]): NodeId[] {
  return positions
    .filter((position) => !position.reportToPositionUniqueId)
    .map((position) => position.uniqueId);
}

export function getDirectChildIds(
  nodeId: NodeId,
  childrenMap: ChildrenMap,
): NodeId[] {
  return childrenMap.get(nodeId) ?? [];
}

export function getDescendantIds(
  nodeIds: Iterable<NodeId>,
  childrenMap: ChildrenMap,
): Set<NodeId> {
  const descendants = new Set<NodeId>();
  const queue = [...nodeIds];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    for (const childId of childrenMap.get(currentId) ?? []) {
      if (!descendants.has(childId)) {
        descendants.add(childId);
        queue.push(childId);
      }
    }
  }

  return descendants;
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

export function getNextCollapsedNodeIds(
  current: Set<NodeId>,
  toggledId: NodeId,
  childToParentMap: Map<NodeId, NodeId>,
  childrenMap: ChildrenMap,
): Set<NodeId> {
  const next = new Set(current);

  if (!next.has(toggledId)) {
    next.add(toggledId);
    return next;
  }

  const parentId = childToParentMap.get(toggledId);
  if (parentId) {
    for (const siblingId of getDirectChildIds(parentId, childrenMap)) {
      if (siblingId !== toggledId) next.add(siblingId);
    }
  }
  next.delete(toggledId);
  return next;
}
