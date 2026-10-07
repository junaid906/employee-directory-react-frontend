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
      className={`absolute bottom-[-12px] z-10 flex items-center justify-center rounded-full p-1 cursor-pointer ${className}`}
      aria-label={isExpanded ? "Collapse" : "Expand"}
    >
      {isExpanded ? (
        <MdKeyboardArrowUp size={15} />
      ) : (
        <MdKeyboardArrowDown size={15} />
      )}
    </button>
  );
}
