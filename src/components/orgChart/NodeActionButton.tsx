import type { ReactNode } from "react";

interface NodeActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  isSelected?: boolean;
}

export default function NodeActionButton({
  icon,
  label,
  onClick,
  isSelected,
}: NodeActionButtonProps) {
  function handleClick(event: React.MouseEvent) {
    event.stopPropagation();
    onClick();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      className={`absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full rounded-br-sm ${isSelected ? "bg-white text-black hover:bg-neutral-200" : "bg-black text-white hover:bg-neutral-800"}`}
    >
      {icon}
    </button>
  );
}
