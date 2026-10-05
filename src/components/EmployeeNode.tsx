import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import { useNavigate } from "react-router";
import type { EmployeeNodeData } from "../lib/orgChart";

export default function EmployeeNode({ data }: NodeProps) {
  const navigate = useNavigate();
  const employee = (data as EmployeeNodeData).employee;
  const fullName = `${employee.firstName} ${employee.lastName}`;

  return (
    <button
      type="button"
      onClick={() => navigate(`/employees/${employee.uniqueId}`)}
      className="flex w-[220px] h-[100px] items-center gap-3 rounded border border-neutral-200 bg-white text-left hover:bg-neutral-50"
    >
      <Handle
        type="target"
        position={Position.Top}
        className="h-2 w-2 border-neutral-400 bg-white"
      />
      {employee.avatarUrl ? (
        <img
          src={employee.avatarUrl}
          alt={fullName}
          className="h-full w-auto shrink-0 object-cover"
        />
      ) : (
        <span
          aria-hidden
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-medium text-neutral-600"
        >
          {employee.firstName.charAt(0)}
          {employee.lastName.charAt(0)}
        </span>
      )}
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-black">
          {fullName}
        </span>
        <span className="block truncate text-xs text-neutral-500">
          {employee.jobTitle}
        </span>
      </span>
      <Handle
        type="source"
        position={Position.Bottom}
        className="h-2 w-2 border-neutral-400 bg-white"
      />
    </button>
  );
}
