import { useEffect, useRef } from "react";
import {
  ReactFlowProvider,
  useNodesInitialized,
  useReactFlow,
} from "@xyflow/react";
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
    selectedNodeId,
    onPaneClick,
    onCollapseAll,
  } = useOrgChart();

  const { fitView } = useReactFlow();
  const nodesInitialized = useNodesInitialized();
  const hasFittedInitialView = useRef(false);

  useEffect(() => {
    if (!nodesInitialized) return;

    if (selectedNodeId) {
      void fitView({
        nodes: [{ id: selectedNodeId }],
        padding: 6,
        duration: 300,
      });
      return;
    }

    if (hasFittedInitialView.current) return;
    hasFittedInitialView.current = true;
    void fitView({ padding: 0.25, duration: 300 });
  }, [nodesInitialized, selectedNodeId, fitView]);

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
