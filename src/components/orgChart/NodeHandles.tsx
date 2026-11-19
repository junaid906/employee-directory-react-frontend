import { Handle, Position } from "@xyflow/react";
import type { NodeUiState } from "../../lib/orgChart/types";
import NodeToggleButton from "./NodeToggleButton";

const handleClasses = "h-2 w-2 border-neutral-400 bg-white";

const toggleClasses = {
  card: {
    selected: "bg-gray-300 text-black hover:bg-neutral-200",
    default: "bg-black text-white hover:bg-neutral-800",
  },
  cluster: {
    selected: "bg-neutral-700 text-white hover:bg-neutral-600",
    default: "bg-black text-white hover:bg-neutral-800",
  },
};

interface NodeHandlesProps {
  state: NodeUiState;
  variant?: keyof typeof toggleClasses;
}

export default function NodeHandles({
  state,
  variant = "card",
}: NodeHandlesProps) {
  const { hasChildren, isExpanded, isSelected, onToggle } = state;
  const classes = toggleClasses[variant];

  return (
    <>
      <Handle type="target" position={Position.Top} className={handleClasses} />
      {hasChildren && (
        <NodeToggleButton
          isExpanded={isExpanded}
          onToggle={onToggle}
          className={isSelected ? classes.selected : classes.default}
        />
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className={handleClasses}
      />
    </>
  );
}
