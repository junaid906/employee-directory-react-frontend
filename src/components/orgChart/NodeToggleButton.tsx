import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

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

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`absolute bottom-[-15px] left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-full p-1.5 cursor-pointer transition-colors ${className}`}
      aria-label={isExpanded ? "Collapse" : "Expand"}
    >
      {isExpanded ? (
        <MdKeyboardArrowUp size={18} />
      ) : (
        <MdKeyboardArrowDown size={18} />
      )}
    </button>
  );
}
