import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import { useNavigate } from "react-router";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { FaExternalLinkSquareAlt } from "react-icons/fa";
import type { EmployeeNodeData } from "../lib/orgChart";

export default function EmployeeNode({ data }: NodeProps) {
  const navigate = useNavigate();
  const nodeData = data as EmployeeNodeData;
  const employee = nodeData.employee;
  const hasChildren = nodeData.hasChildren;
  const isExpanded = nodeData.isExpanded;
  const isSelected = nodeData.isSelected;
  const onToggle = nodeData.onToggle;
  const onSelect = nodeData.onSelect;
  const fullName = `${employee.firstName} ${employee.lastName}`;

  function handleViewClick(event: React.MouseEvent) {
    event.stopPropagation();
    navigate(`/employees/${employee.uniqueId}`);
  }

  function handleToggleClick(event: React.MouseEvent) {
    event.stopPropagation();
    onToggle?.();
  }

  function handleSelectClick(event: React.MouseEvent) {
    event.stopPropagation();
    onSelect?.();
  }

  const containerClasses = isSelected
    ? "bg-black text-white "
    : "bg-white text-black ";

  const avatarClasses = isSelected
    ? "bg-neutral-700 text-white"
    : "bg-neutral-200 text-neutral-600";

  const nameClasses = isSelected ? "text-white" : "text-black";

  const subtitleClasses = isSelected ? "text-neutral-300" : "text-neutral-500";

  const viewButtonClasses = isSelected
    ? "bg-white text-black hover:bg-neutral-200"
    : "bg-black text-white hover:bg-neutral-800";

  const chevronBgClasses = isSelected
    ? "bg-gray-300 text-black hover:bg-neutral-200"
    : "bg-black text-white hover:bg-neutral-800";

  return (
    <div
      className={`relative flex h-[100px] w-[300px] flex-col items-center border rounded transition-colors duration-300 ${containerClasses}`}
    >
      <div className="flex h-full w-full justify-between">
        <Handle
          type="target"
          position={Position.Top}
          className="h-2 w-2 border-neutral-400 bg-white"
        />
        <button
          type="button"
          onClick={handleSelectClick}
          className="flex h-full w-full cursor-pointer gap-3 "
        >
          <div className="flex gap-3 h-full text-left">
            {employee.avatarUrl ? (
              <img
                src={employee.avatarUrl}
                alt={fullName}
                className="h-full w-auto shrink-0 object-cover"
              />
            ) : (
              <span
                aria-hidden
                className={`flex h-full w-[100px] shrink-0 items-center justify-center text-lg font-semibold ${avatarClasses}`}
              >
                {employee.firstName.charAt(0)}.{employee.lastName.charAt(0)}
              </span>
            )}
            <span className="min-w-0 py-3">
              <span
                className={`block truncate font-bold leading-none ${nameClasses}`}
              >
                {fullName}
              </span>
              <span className={`block truncate text-xs ${subtitleClasses}`}>
                {employee.jobTitle}
              </span>
            </span>
          </div>
        </button>
        <div className="flex w-fit items-center justify-between pr-2">
          <button
            type="button"
            onClick={handleViewClick}
            className={`flex h-8 w-8 items-center hover:cursor-pointer hover:shadow-2xl justify-center rounded-full px-3 py-1.5 text-xs font-medium shadow-2xl ${viewButtonClasses}`}
          >
            <FaExternalLinkSquareAlt className="h-4 w-4" />
          </button>
        </div>
        <Handle
          type="source"
          position={Position.Bottom}
          className="h-2 w-2 border-neutral-400 bg-white"
        />
      </div>
      {hasChildren && (
        <button
          type="button"
          onClick={handleToggleClick}
          className={`absolute bottom-[-12px] z-10 flex items-center justify-center rounded-full p-1 cursor-pointer ${chevronBgClasses}`}
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <MdKeyboardArrowUp size={15} />
          ) : (
            <MdKeyboardArrowDown size={15} />
          )}
        </button>
      )}
    </div>
  );
}
