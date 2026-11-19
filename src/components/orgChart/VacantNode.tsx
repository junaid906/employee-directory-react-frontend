import type { NodeProps } from "@xyflow/react";
import type { VacantFlowNode } from "../../lib/orgChart/types";
import EmployeeCard from "./EmployeeCard";
import NodeActions from "./NodeActions";
import NodeHandles from "./NodeHandles";

export default function VacantNode({ data }: NodeProps<VacantFlowNode>) {
  const { position, isSelected, onSelect } = data;

  return (
    <EmployeeCard
      placeholderAvatar
      name="Currently Vacant"
      jobTitle={position.jobTitle}
      isSelected={isSelected}
      onSelect={onSelect}
    >
      <NodeActions
        positionUniqueId={position.uniqueId}
        jobTitle={position.jobTitle}
        isSelected={isSelected}
      />
      <NodeHandles state={data} />
    </EmployeeCard>
  );
}
