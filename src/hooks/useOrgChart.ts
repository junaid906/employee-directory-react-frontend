import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { listEmployees } from "../api/employees";
import { getPositions } from "../api/positions";
import { useAsyncData } from "./useAsyncData";
import { ORG_CHART_LOAD_ERROR } from "../lib/messages";
import { buildGraph, filterNodesAndEdges } from "../lib/orgChart/graph";
import { layoutGraph } from "../lib/orgChart/layout";
import {
  buildChildToParentMap,
  buildChildrenMap,
  getAncestorIds,
  getDescendantIds,
  getDirectChildIds,
  getNextCollapsedNodeIds,
  getRootNodeIds,
} from "../lib/orgChart/tree";
import type {
  NodeId,
  NodeUiState,
  OrgChartNode,
} from "../lib/orgChart/types";

function withUiState<T extends OrgChartNode>(node: T, ui: NodeUiState): T {
  return { ...node, data: { ...node.data, ...ui } };
}

export function useOrgChart() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, loading, error } = useAsyncData(
    "org-chart",
    () =>
      Promise.all([listEmployees(), getPositions()]).then(
        ([employees, positions]) => ({ employees, positions }),
      ),
    ORG_CHART_LOAD_ERROR,
  );

  const employees = useMemo(() => data?.employees ?? [], [data]);
  const positions = useMemo(() => data?.positions ?? [], [data]);

  const { nodes: allNodes, edges: allEdges } = useMemo(
    () => buildGraph(employees, positions),
    [employees, positions],
  );

  const childrenMap = useMemo(() => buildChildrenMap(positions), [positions]);

  const childToParentMap = useMemo(
    () => buildChildToParentMap(childrenMap),
    [childrenMap],
  );

  const initiallyCollapsedNodeIds = useMemo(
    () => getDescendantIds(getRootNodeIds(positions), childrenMap),
    [positions, childrenMap],
  );

  const [collapsedNodeIds, setCollapsedNodeIds] = useState<Set<NodeId> | null>(
    null,
  );
  const selectedNodeId = searchParams.get("selected");

  const [revealedNodeId] = useState<string | null>(() =>
    searchParams.get("selected"),
  );

  const setSelectedNodeId = useCallback(
    (update: (prev: string | null) => string | null) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const nodeId = update(prev.get("selected"));
          if (nodeId) next.set("selected", nodeId);
          else next.delete("selected");
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const effectiveCollapsedNodeIds = useMemo(() => {
    const base = collapsedNodeIds ?? initiallyCollapsedNodeIds;

    if (collapsedNodeIds !== null || !revealedNodeId) return base;

    const revealed = new Set(base);
    for (const ancestorId of getAncestorIds(revealedNodeId, childToParentMap)) {
      revealed.delete(ancestorId);
    }
    return revealed;
  }, [
    collapsedNodeIds,
    initiallyCollapsedNodeIds,
    revealedNodeId,
    childToParentMap,
  ]);

  const hiddenNodeIds = useMemo(
    () => getDescendantIds(effectiveCollapsedNodeIds, childrenMap),
    [effectiveCollapsedNodeIds, childrenMap],
  );

  const { visibleNodes, visibleEdges } = useMemo(
    () => filterNodesAndEdges(allNodes, allEdges, hiddenNodeIds),
    [allNodes, allEdges, hiddenNodeIds],
  );

  const handleToggle = useCallback(
    (nodeId: NodeId) => {
      setCollapsedNodeIds((prev) =>
        getNextCollapsedNodeIds(
          prev ?? initiallyCollapsedNodeIds,
          nodeId,
          childToParentMap,
          childrenMap,
        ),
      );
    },
    [initiallyCollapsedNodeIds, childToParentMap, childrenMap],
  );

  const handleNodeSelect = useCallback(
    (nodeId: NodeId) => {
      setSelectedNodeId((prev) => (prev === nodeId ? null : nodeId));
    },
    [setSelectedNodeId],
  );

  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(() => null);
  }, [setSelectedNodeId]);

  const handleCollapseAll = useCallback(() => {
    setCollapsedNodeIds(
      getDescendantIds(
        allNodes.map((node) => node.id),
        childrenMap,
      ),
    );
  }, [allNodes, childrenMap]);

  const laidOutNodes = useMemo(
    () => layoutGraph(visibleNodes, visibleEdges),
    [visibleNodes, visibleEdges],
  );

  const nodes = useMemo(
    () =>
      laidOutNodes.map((node) =>
        withUiState(node, {
          hasChildren: getDirectChildIds(node.id, childrenMap).length > 0,
          isExpanded: !effectiveCollapsedNodeIds.has(node.id),
          isSelected: node.id === selectedNodeId,
          onToggle: () => handleToggle(node.id),
          onSelect: () => handleNodeSelect(node.id),
        }),
      ),
    [
      laidOutNodes,
      childrenMap,
      effectiveCollapsedNodeIds,
      selectedNodeId,
      handleToggle,
      handleNodeSelect,
    ],
  );

  return {
    loading,
    error,
    isEmpty: employees.length === 0,
    nodes,
    edges: visibleEdges,
    selectedNodeId,
    onPaneClick: handlePaneClick,
    onCollapseAll: handleCollapseAll,
  };
}
