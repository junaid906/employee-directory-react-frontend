import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { getPositions, listEmployees } from "../api/employees";
import { useAsyncData } from "./useAsyncData";
import { ORG_CHART_LOAD_ERROR } from "../lib/messages";
import {
  buildChildToParentMap,
  buildChildrenMapFromEdges,
  buildGraph,
  filterNodesAndEdges,
  getAllDescendantIds,
  getDirectChildIds,
  getHiddenNodeIds,
  getNextCollapsedNodeIds,
  getNodesToShowAsCollapsed,
  getRootNodeIds,
  layoutGraph,
  type NodeId,
} from "../lib/orgChart";

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

  const childrenMap = useMemo(
    () => buildChildrenMapFromEdges(allEdges),
    [allEdges],
  );

  const rootNodeIds = useMemo(() => getRootNodeIds(positions), [positions]);

  const childToParentMap = useMemo(
    () => buildChildToParentMap(childrenMap),
    [childrenMap],
  );

  const initiallyCollapsedNodeIds = useMemo(
    () => getNodesToShowAsCollapsed(rootNodeIds, childrenMap),
    [rootNodeIds, childrenMap],
  );

  const [collapsedNodeIds, setCollapsedNodeIds] = useState<Set<NodeId> | null>(
    null,
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(() =>
    searchParams.get("selected"),
  );

  useEffect(() => {
    if (selectedNodeId) {
      setSearchParams({ selected: selectedNodeId });
    } else {
      setSearchParams({});
    }
  }, [selectedNodeId, setSearchParams]);

  const effectiveCollapsedNodeIds =
    collapsedNodeIds ?? initiallyCollapsedNodeIds;

  const hiddenNodeIds = useMemo(
    () => getHiddenNodeIds(effectiveCollapsedNodeIds, childrenMap),
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

  const handleNodeSelect = useCallback((nodeId: NodeId) => {
    setSelectedNodeId((prev) => (prev === nodeId ? null : nodeId));
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const handleCollapseAll = useCallback(() => {
    const allDescendants = new Set<NodeId>();
    for (const node of allNodes) {
      for (const descendantId of getAllDescendantIds(node.id, childrenMap)) {
        allDescendants.add(descendantId);
      }
    }
    setCollapsedNodeIds(allDescendants);
  }, [allNodes, childrenMap]);

  const nodesWithData = useMemo(() => {
    return visibleNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        hasChildren: getDirectChildIds(node.id, childrenMap).length > 0,
        isExpanded: !effectiveCollapsedNodeIds.has(node.id),
        isSelected: node.id === selectedNodeId,
        onToggle: () => handleToggle(node.id),
        onSelect: () => handleNodeSelect(node.id),
      },
    }));
  }, [
    visibleNodes,
    childrenMap,
    effectiveCollapsedNodeIds,
    selectedNodeId,
    handleToggle,
    handleNodeSelect,
  ]);

  const nodesAfterLayout = useMemo(
    () => layoutGraph(nodesWithData, visibleEdges).nodes,
    [nodesWithData, visibleEdges],
  );

  return {
    loading,
    error,
    isEmpty: employees.length === 0,
    nodes: nodesAfterLayout,
    edges: visibleEdges,
    visibleNodes,
    selectedNodeId,
    onPaneClick: handlePaneClick,
    onCollapseAll: handleCollapseAll,
  };
}
