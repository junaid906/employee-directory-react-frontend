import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ReactFlowProvider, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import { FloatingHeader } from "../components/Header";
import OrgChartCanvas from "../components/orgChart/OrgChartCanvas";
import Spinner from "../components/ui/Spinner";
import { useMinimumDelay } from "../hooks/useMinimumDelay";
import { useOrgChart } from "../hooks/useOrgChart";
import { cx } from "../lib/cx";

function CenteredOverlay({ children }: { children: ReactNode }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
      <div className="pointer-events-auto w-full max-w-md">{children}</div>
    </div>
  );
}

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

  const { fitView, viewportInitialized } = useReactFlow();
  const hasFittedInitialView = useRef(false);
  const hasFittedOnce = useRef(false);
  const [fitted, setFitted] = useState(false);
  const ready = useMinimumDelay(fitted, 300);
  const visibleNodeCount = nodes.length;

  useEffect(() => {
    if (!viewportInitialized || visibleNodeCount === 0) return;

    const duration = hasFittedOnce.current ? 300 : 0;

    if (selectedNodeId) {
      hasFittedOnce.current = true;
      void fitView({
        nodes: [{ id: selectedNodeId }],
        padding: 6,
        duration,
      }).then(() => setFitted(true));
      return;
    }

    if (hasFittedInitialView.current) return;
    hasFittedInitialView.current = true;
    hasFittedOnce.current = true;
    void fitView({ padding: 0.25, duration }).then(() => setFitted(true));
  }, [viewportInitialized, visibleNodeCount, selectedNodeId, fitView]);

  const showCanvas = !loading && !error && !isEmpty;
  const showSpinner = loading || (showCanvas && visibleNodeCount > 0 && !ready);

  return (
    <div className="relative h-screen w-full bg-white">
      <FloatingHeader />

      {error && (
        <CenteredOverlay>
          <ErrorState message={error} />
        </CenteredOverlay>
      )}

      {!loading && !error && isEmpty && (
        <CenteredOverlay>
          <EmptyState message="No employees found." />
        </CenteredOverlay>
      )}

      {showCanvas && (
        <div
          className={cx(
            "h-full w-full transition-opacity duration-300",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          <OrgChartCanvas
            nodes={nodes}
            edges={edges}
            onPaneClick={onPaneClick}
            onCollapseAll={onCollapseAll}
          />
        </div>
      )}

      {showSpinner && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <Spinner label="Loading org chart…" />
        </div>
      )}
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
