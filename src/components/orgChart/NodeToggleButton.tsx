import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import Tooltip from "../ui/Tooltip";

interface NodeToggleButtonProps {
  isExpanded?: boolean;
  className: string;
  onToggle?: () => void;
}

export default function NodeToggleButton({
  isExpanded,
  className,
  onToggle,
}: NodeToggleButtonProps) {
  function handleClick(event: React.MouseEvent) {
    event.stopPropagation();
    onToggle?.();
  }

  const label = isExpanded ? "Collapse reports" : "Expand reports";

  return (
    <Tooltip label={label}>
      <button
        type="button"
        onClick={handleClick}
        className={`nodrag nopan absolute bottom-[-15px] left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-full p-1.5 cursor-pointer transition-colors ${className}`}
        aria-label={label}
      >
        {isExpanded ? (
          <MdKeyboardArrowUp size={18} />
        ) : (
          <MdKeyboardArrowDown size={18} />
        )}
      </button>
    </Tooltip>
  );
}
