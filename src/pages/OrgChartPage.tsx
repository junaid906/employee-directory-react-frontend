import { useEffect, useRef } from "react";
import { ReactFlowProvider, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import { FloatingHeader } from "../components/Header";
import LoadingState from "../components/LoadingState";
import OrgChartCanvas from "../components/orgChart/OrgChartCanvas";
import { useOrgChart } from "../hooks/useOrgChart";

function OrgChart() {
  const {
    loading,
    error,
    isEmpty,
    nodes,
    edges,
    visibleNodes,
    selectedNodeId,
    onPaneClick,
    onCollapseAll,
  } = useOrgChart();

  const { fitView, getNode } = useReactFlow();
  const hasFittedInitialView = useRef(false);

  useEffect(() => {
    if (hasFittedInitialView.current || selectedNodeId) return;
    if (visibleNodes.length === 0) return;

    hasFittedInitialView.current = true;

    const timer = setTimeout(() => {
      fitView({ padding: 0.25, duration: 300 });
    }, 100);

    return () => clearTimeout(timer);
  }, [visibleNodes, selectedNodeId, fitView]);

  useEffect(() => {
    if (!selectedNodeId) return;
    const node = getNode(selectedNodeId);
    if (!node) return;

    const timer = setTimeout(() => {
      fitView({ nodes: [node], padding: 6, duration: 300 });
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedNodeId, visibleNodes, fitView, getNode]);

  if (loading) {
    return <LoadingState message="Loading org chart…" />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (isEmpty) {
    return <EmptyState message="No employees found." />;
  }

  return (
    <div className="relative h-screen w-full bg-white">
      <FloatingHeader />
      <OrgChartCanvas
        nodes={nodes}
        edges={edges}
        onPaneClick={onPaneClick}
        onCollapseAll={onCollapseAll}
      />
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
