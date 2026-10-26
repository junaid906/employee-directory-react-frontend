import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { FaEdit, FaEye, FaPlus, FaUserPlus } from "react-icons/fa";
import type { Employee } from "../../types/employee";

interface ActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  isSelected?: boolean;
  className: string;
}

function ActionButton({
  icon,
  label,
  onClick,
  isSelected,
  className,
}: ActionButtonProps) {
  function handleClick(event: React.MouseEvent) {
    event.stopPropagation();
    onClick();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      className={`flex items-center justify-center transition-colors ${className} ${isSelected ? "bg-white text-black hover:bg-neutral-200" : "bg-black text-white hover:bg-neutral-800"}`}
    >
      {icon}
    </button>
  );
}

export type NodeActionKind = "employee" | "addPosition" | "editPosition";

interface NodeActionsProps {
  positionUniqueId: string;
  isSelected?: boolean;
  employee?: Employee;
  jobTitle?: string;
  actions?: NodeActionKind[];
}

const DEFAULT_ACTIONS: NodeActionKind[] = [
  "employee",
  "addPosition",
  "editPosition",
];

const topRightButtonClasses = "h-7 w-7 rounded-full rounded-r-none";

export default function NodeActions({
  positionUniqueId,
  isSelected,
  employee,
  jobTitle,
  actions = DEFAULT_ACTIONS,
}: NodeActionsProps) {
  const navigate = useNavigate();

  return (
    <>
      {actions.includes("addPosition") && (
        <ActionButton
          isSelected={isSelected}
          label="Add position below"
          icon={<FaPlus size={15} />}
          onClick={() =>
            navigate(`/positions/create?parent=${positionUniqueId}`)
          }
          className="absolute bottom-[-10px] left-[-10px] z-10 cursor-pointer rounded-full p-1.5"
        />
      )}

      {(actions.includes("editPosition") || actions.includes("employee")) && (
        <div className="absolute right-0 top-1 z-10 flex flex-col gap-px">
          {actions.includes("editPosition") && (
            <ActionButton
              isSelected={isSelected}
              label="Edit position"
              icon={<FaEdit className="h-4 w-4" />}
              onClick={() => navigate(`/positions/${positionUniqueId}/edit`)}
              className={topRightButtonClasses}
            />
          )}

          {actions.includes("employee") && (
            <ActionButton
              isSelected={isSelected}
              label={
                employee
                  ? `View ${employee.firstName} ${employee.lastName}`
                  : `Add employee to ${jobTitle ?? "position"}`
              }
              icon={
                employee ? (
                  <FaEye className="h-3.5 w-3.5" />
                ) : (
                  <FaUserPlus className="h-4 w-4" />
                )
              }
              onClick={() =>
                navigate(
                  employee
                    ? `/employees/${employee.uniqueId}`
                    : `/employees/create?position=${positionUniqueId}`,
                )
              }
              className={topRightButtonClasses}
            />
          )}
        </div>
      )}
    </>
  );
}
