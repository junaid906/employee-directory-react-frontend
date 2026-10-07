import {
  Background,
  ControlButton,
  Controls,
  ReactFlow,
} from "@xyflow/react";
import type { Edge } from "@xyflow/react";
import { MdUnfoldMore } from "react-icons/md";
import type { OrgChartNode } from "../../lib/orgChart";
import EmployeeNode from "./EmployeeNode";
import ManagerClusterNode from "./ManagerClusterNode";
import VacantNode from "./VacantNode";

const nodeTypes = {
  employee: EmployeeNode,
  managerCluster: ManagerClusterNode,
  vacant: VacantNode,
};

interface OrgChartCanvasProps {
  nodes: OrgChartNode[];
  edges: Edge[];
  onPaneClick: () => void;
  onCollapseAll: () => void;
}

export default function OrgChartCanvas({
  nodes,
  edges,
  onPaneClick,
  onCollapseAll,
}: OrgChartCanvasProps) {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onPaneClick={onPaneClick}
      minZoom={0.1}
      maxZoom={2}
    >
      <Background />
      <Controls>
        <ControlButton
          onClick={onCollapseAll}
          title="Collapse All"
          aria-label="Collapse All"
        >
          <MdUnfoldMore size={16} />
        </ControlButton>
      </Controls>
    </ReactFlow>
  );
}
