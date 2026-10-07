import type { ReactNode } from "react";
import Avatar from "../Avatar";

interface EmployeeCardProps {
  avatarUrl?: string | null;
  firstName?: string;
  lastName?: string;
  name: string;
  jobTitle?: string;
  isSelected?: boolean;
  placeholderAvatar?: boolean;
  onSelect?: () => void;
  action?: ReactNode;
  children?: ReactNode;
}

export default function EmployeeCard({
  avatarUrl,
  firstName,
  lastName,
  name,
  jobTitle,
  isSelected,
  placeholderAvatar,
  onSelect,
  action,
  children,
}: EmployeeCardProps) {
  const containerClasses = isSelected
    ? "bg-black text-white"
    : "bg-white text-black";

  const avatarBgClasses = isSelected
    ? "bg-neutral-700 text-white"
    : "bg-neutral-200 text-neutral-600";

  return (
    <div
      className={`relative flex h-[180px] w-[180px] flex-col items-center border rounded transition-colors duration-300 ${containerClasses}`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 p-3"
      >
        <Avatar
          src={avatarUrl}
          firstName={firstName}
          lastName={lastName}
          placeholder={placeholderAvatar}
          size="md"
          className={avatarBgClasses}
        />
        <div>
          <span
            className={`block truncate text-center text-sm font-bold leading-tight ${isSelected ? "text-white" : "text-black"}`}
          >
            {name}
          </span>
          {jobTitle && (
            <span
              className={`block truncate text-center text-xs leading-tight ${isSelected ? "text-neutral-300" : "text-neutral-500"}`}
            >
              {jobTitle}
            </span>
          )}
        </div>
      </button>

      {action}
      {children}
    </div>
  );
}
