import { useEffect, useMemo, useState } from "react";
import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useSearchParams } from "react-router";
import { listEmployees } from "../api/employees";
import type { Employee } from "../types/employee";
import EmployeeNode from "../components/EmployeeNode";
import { FloatingHeader } from "../components/Header";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import {
  buildGraph,
  layoutGraph,
  buildChildrenMapFromEdges,
  getDirectChildIds,
  getAllDescendantIds,
  getHiddenNodeIds,
  getRootNodeIds,
  getNodesToShowAsCollapsed,
  filterNodesAndEdges,
  type NodeId,
} from "../lib/orgChart";
import { MdUnfoldLess, MdUnfoldMore } from "react-icons/md";

const nodeTypes = { employee: EmployeeNode };

function OrgChart() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collapsedNodeIds, setCollapsedNodeIds] = useState<Set<NodeId> | null>(
    null,
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(() => {
    return searchParams.get("selected");
  });

  const { fitView, getNode } = useReactFlow();

  useEffect(() => {
    if (selectedNodeId) {
      setSearchParams({ selected: selectedNodeId });
    } else {
      setSearchParams({});
    }
  }, [selectedNodeId, setSearchParams]);

  useEffect(() => {
    let cancelled = false;
    listEmployees()
      .then((data) => {
        if (!cancelled) setEmployees(data);
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "Could not load employees. Is the API running on http://localhost:5102?",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { nodes: allNodes, edges: allEdges } = useMemo(() => {
    return buildGraph(employees);
  }, [employees]);

  const childrenMap = useMemo(() => {
    return buildChildrenMapFromEdges(allEdges);
  }, [allEdges]);

  const rootNodeIds = useMemo(() => {
    return getRootNodeIds(employees);
  }, [employees]);

  const initiallyCollapsedNodeIds = useMemo(() => {
    return getNodesToShowAsCollapsed(rootNodeIds, childrenMap);
  }, [rootNodeIds, childrenMap]);

  const hiddenNodeIds = useMemo(() => {
    const collapsedIds = collapsedNodeIds ?? initiallyCollapsedNodeIds;
    return getHiddenNodeIds(collapsedIds, childrenMap);
  }, [collapsedNodeIds, initiallyCollapsedNodeIds, childrenMap]);

  const { visibleNodes, visibleEdges } = useMemo(() => {
    return filterNodesAndEdges(allNodes, allEdges, hiddenNodeIds);
  }, [allNodes, allEdges, hiddenNodeIds]);

  useEffect(() => {
    if (selectedNodeId) {
      const node = getNode(selectedNodeId);
      if (node) {
        setTimeout(() => {
          fitView({
            nodes: [node],
            padding: 6,
            duration: 300,
          });
        }, 100);
      }
    }
  }, [selectedNodeId, visibleNodes, fitView, getNode]);

  function handlePaneClick() {
    setSelectedNodeId(null);
  }

  function handleNodeSelect(nodeId: string) {
    setSelectedNodeId((prev) => (prev === nodeId ? null : nodeId));
  }

  const nodesWithData = useMemo(() => {
    return visibleNodes.map((node) => {
      const directChildIds = getDirectChildIds(node.id, childrenMap);
      const effectiveCollapsedIds =
        collapsedNodeIds ?? initiallyCollapsedNodeIds;
      const isNodeCollapsed = effectiveCollapsedIds.has(node.id);

      return {
        ...node,
        data: {
          ...node.data,
          hasChildren: directChildIds.length > 0,
          isExpanded: !isNodeCollapsed,
          isSelected: node.id === selectedNodeId,
          onToggle: () => {
            setCollapsedNodeIds((prev) => {
              const effectivePrev = prev ?? initiallyCollapsedNodeIds;
              const next = new Set(effectivePrev);
              if (next.has(node.id)) {
                next.delete(node.id);
              } else {
                next.add(node.id);
              }
              return next;
            });
          },
          onSelect: () => handleNodeSelect(node.id),
        },
      };
    });
  }, [
    visibleNodes,
    childrenMap,
    collapsedNodeIds,
    initiallyCollapsedNodeIds,
    selectedNodeId,
  ]);

  const nodesAfterLayout = useMemo(() => {
    const result = layoutGraph(nodesWithData, visibleEdges);
    return result.nodes;
  }, [nodesWithData, visibleEdges]);

  if (loading) {
    return <LoadingState message="Loading org chart…" />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (employees.length === 0) {
    return <p className="text-neutral-500">No employees found.</p>;
  }

  function handleExpandAll() {
    setCollapsedNodeIds(new Set());
  }

  function handleCollapseAll() {
    const allNodeIds = allNodes.map((node) => node.id);
    const allDescendants = new Set<NodeId>();

    for (const nodeId of allNodeIds) {
      const descendants = getAllDescendantIds(nodeId, childrenMap);
      for (const descendantId of descendants) {
        allDescendants.add(descendantId);
      }
    }

    setCollapsedNodeIds(allDescendants);
  }

  return (
    <div className="relative h-screen w-full bg-white">
      <FloatingHeader />
      <ReactFlow
        nodes={nodesAfterLayout}
        edges={visibleEdges}
        nodeTypes={nodeTypes}
        onPaneClick={handlePaneClick}
      >
        <Background />
        <Controls />
      </ReactFlow>

      <div className="absolute bottom-4 left-4 z-50 flex gap-2">
        <button
          type="button"
          onClick={handleExpandAll}
          className="flex items-center gap-1.5 rounded bg-white px-3 py-2 text-sm font-medium text-black shadow-md border border-neutral-200 hover:bg-neutral-50"
        >
          <MdUnfoldLess size={18} />
          Expand All
        </button>
        <button
          type="button"
          onClick={handleCollapseAll}
          className="flex items-center gap-1.5 rounded bg-white px-3 py-2 text-sm font-medium text-black shadow-md border border-neutral-200 hover:bg-neutral-50"
        >
          <MdUnfoldMore size={18} />
          Collapse All
        </button>
      </div>
    </div>
  );
}

export default function OrgChartPage() {
  return (
    <ReactFlowProvider>
      <OrgChart />
    </ReactFlowProvider>
  );
}
