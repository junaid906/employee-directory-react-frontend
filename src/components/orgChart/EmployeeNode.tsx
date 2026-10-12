import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import EmployeeCard from "./EmployeeCard";
import NodeActions from "./NodeActions";
import NodeToggleButton from "./NodeToggleButton";
import type { EmployeeNodeData } from "../../lib/orgChart";

export default function EmployeeNode({ data }: NodeProps) {
  const nodeData = data as EmployeeNodeData;
  const employee = nodeData.employee;
  const jobTitle = nodeData.jobTitle;
  const hasChildren = nodeData.hasChildren;
  const isExpanded = nodeData.isExpanded;
  const isSelected = nodeData.isSelected;
  const onToggle = nodeData.onToggle;
  const onSelect = nodeData.onSelect;

  const chevronBgClasses = isSelected
    ? "bg-gray-300 text-black hover:bg-neutral-200"
    : "bg-black text-white hover:bg-neutral-800";

  return (
    <EmployeeCard
      avatarUrl={employee.avatarUrl}
      firstName={employee.firstName}
      lastName={employee.lastName}
      name={`${employee.firstName} ${employee.lastName}`}
      jobTitle={jobTitle}
      isSelected={isSelected}
      onSelect={onSelect}
    >
      <NodeActions
        positionUniqueId={employee.positionUniqueId}
        employee={employee}
        jobTitle={jobTitle}
        isSelected={isSelected}
      />

      <Handle
        type="target"
        position={Position.Top}
        className="h-2 w-2 border-neutral-400 bg-white"
      />

      {hasChildren && (
        <NodeToggleButton
          isExpanded={isExpanded}
          onToggle={onToggle}
          className={chevronBgClasses}
        />
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="h-2 w-2 border-neutral-400 bg-white"
      />
    </EmployeeCard>
  );
}
