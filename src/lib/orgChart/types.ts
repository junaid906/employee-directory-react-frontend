import type { Node } from "@xyflow/react";
import type { Employee } from "../../types/employee";
import type { Position } from "../../types/position";

export type NodeId = string;
export type ChildrenMap = Map<NodeId, NodeId[]>;

export type NodeUiState = {
  hasChildren?: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
  onToggle?: () => void;
  onSelect?: () => void;
};

export type EmployeeNodeData = NodeUiState & {
  employee: Employee;
  jobTitle: string;
};

export type ManagerClusterNodeData = NodeUiState & {
  position: Position;
  employees: Employee[];
};

export type VacantNodeData = NodeUiState & {
  position: Position;
};

export type EmployeeFlowNode = Node<EmployeeNodeData, "employee">;
export type ManagerClusterFlowNode = Node<
  ManagerClusterNodeData,
  "managerCluster"
>;
export type VacantFlowNode = Node<VacantNodeData, "vacant">;

export type OrgChartNode =
  | EmployeeFlowNode
  | ManagerClusterFlowNode
  | VacantFlowNode;
