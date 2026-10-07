import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import { useNavigate } from "react-router";
import { FiPlus } from "react-icons/fi";
import EmployeeCard from "./EmployeeCard";
import NodeActionButton from "./NodeActionButton";
import NodeToggleButton from "./NodeToggleButton";
import type { VacantNodeData } from "../../lib/orgChart";

export default function VacantNode({ data }: NodeProps) {
  const navigate = useNavigate();
  const nodeData = data as VacantNodeData;
  const position = nodeData.position;
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
      placeholderAvatar
      name="Currently Vacant"
      jobTitle={position.jobTitle}
      isSelected={isSelected}
      onSelect={onSelect}
      action={
        <NodeActionButton
          isSelected={isSelected}
          label={`Add employee to ${position.jobTitle}`}
          icon={<FiPlus className="h-4 w-4" />}
          onClick={() =>
            navigate(`/employees/create?position=${position.uniqueId}`)
          }
        />
      }
    >
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
