import type { NodeProps } from "@xyflow/react";
import { getClusterWidth } from "../../lib/orgChart/layout";
import type { ManagerClusterFlowNode } from "../../lib/orgChart/types";
import EmployeeCard from "./EmployeeCard";
import NodeActions from "./NodeActions";
import NodeHandles from "./NodeHandles";

export default function ManagerClusterNode({
  data,
}: NodeProps<ManagerClusterFlowNode>) {
  const { position, employees, isSelected, onSelect } = data;

  const containerClasses = isSelected
    ? "bg-black text-white hover:bg-neutral-800"
    : "bg-white text-black hover:bg-neutral-50";

  const borderClasses = isSelected
    ? "border-white"
    : "border-neutral-300 hover:border-neutral-500";

  return (
    <div
      style={{ width: getClusterWidth(employees.length) }}
      className={`relative flex min-h-[180px] flex-col items-center rounded border border-gray-900 p-3 pb-6 transition-colors duration-300 ${containerClasses} ${borderClasses}`}
    >
      <div className="mb-2 w-full text-center">
        <span
          className={`text-sm font-bold ${isSelected ? "text-white" : "text-black"}`}
        >
          {position.jobTitle}
        </span>
      </div>

      <button
        type="button"
        onClick={onSelect}
        className="absolute inset-0 cursor-pointer"
        aria-label={`Select ${position.jobTitle}`}
      />

      <NodeActions
        positionUniqueId={position.uniqueId}
        actions={["addPosition", "editPosition"]}
        isSelected={isSelected}
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
          >
            <NodeActions
              positionUniqueId={position.uniqueId}
              employee={employee}
              actions={["employee"]}
              isSelected={isSelected}
            />
          </EmployeeCard>
        ))}
      </div>

      <NodeHandles state={data} variant="cluster" />
    </div>
  );
}
