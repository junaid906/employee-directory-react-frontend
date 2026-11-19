import type { NodeProps } from "@xyflow/react";
import type { EmployeeFlowNode } from "../../lib/orgChart/types";
import EmployeeCard from "./EmployeeCard";
import NodeActions from "./NodeActions";
import NodeHandles from "./NodeHandles";

export default function EmployeeNode({ data }: NodeProps<EmployeeFlowNode>) {
  const { employee, jobTitle, isSelected, onSelect } = data;

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
      <NodeHandles state={data} />
    </EmployeeCard>
  );
}
