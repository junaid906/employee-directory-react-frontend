import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import { useNavigate } from "react-router";
import { FaExternalLinkSquareAlt } from "react-icons/fa";
import EmployeeCard from "./EmployeeCard";
import NodeActionButton from "./NodeActionButton";
import NodeToggleButton from "./NodeToggleButton";
import {
  getClusterWidth,
  type ManagerClusterNodeData,
} from "../../lib/orgChart";

export default function ManagerClusterNode({ data }: NodeProps) {
  const navigate = useNavigate();
  const nodeData = data as ManagerClusterNodeData;
  const position = nodeData.position;
  const employees = nodeData.employees;
  const hasChildren = nodeData.hasChildren;
  const isExpanded = nodeData.isExpanded;
  const isSelected = nodeData.isSelected;
  const onToggle = nodeData.onToggle;
  const onSelect = nodeData.onSelect;

  const containerClasses = isSelected
    ? "bg-black text-white"
    : "bg-white text-black";

  const borderClasses = isSelected ? "border-white" : "border-neutral-300";

  return (
    <div
      style={{ width: getClusterWidth(employees.length) }}
      className={`relative flex min-h-[180px] flex-col items-center rounded border-2 p-3 transition-colors duration-300 ${containerClasses} ${borderClasses}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="h-2 w-2 border-neutral-400 bg-white"
      />

      <div className="mb-2 w-full text-center">
        <span className={`text-sm font-bold ${isSelected ? "text-white" : "text-black"}`}>
          {position.jobTitle}
        </span>
      </div>

      <button
        type="button"
        onClick={onSelect}
        className="absolute inset-0 cursor-pointer"
        aria-label={`Select ${position.jobTitle}`}
      />

      <div className="flex flex-wrap justify-center gap-1">
        {employees.map((employee) => (
          <EmployeeCard
            key={employee.uniqueId}
            avatarUrl={employee.avatarUrl}
            firstName={employee.firstName}
            lastName={employee.lastName}
            name={`${employee.firstName} ${employee.lastName}`}
            jobTitle={position.jobTitle}
            isSelected={isSelected}
            onSelect={onSelect}
            action={
              <NodeActionButton
                isSelected={isSelected}
                label={`View ${employee.firstName} ${employee.lastName}`}
                icon={<FaExternalLinkSquareAlt className="h-3.5 w-3.5" />}
                onClick={() => navigate(`/employees/${employee.uniqueId}`)}
              />
            }
          />
        ))}
      </div>

      {hasChildren && (
        <NodeToggleButton
          isExpanded={isExpanded}
          onToggle={onToggle}
          className={
            isSelected
              ? "bg-neutral-700 text-white hover:bg-neutral-600"
              : "bg-black text-white hover:bg-neutral-800"
          }
        />
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="h-2 w-2 border-neutral-400 bg-white"
      />
    </div>
  );
}
