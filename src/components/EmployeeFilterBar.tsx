import type { EmployeeFiltersState } from "../hooks/useEmployeeFilters";
import type { Department, SubDepartment } from "../types/department";
import type { Position } from "../types/position";
import SelectInput from "./ui/SelectInput";
import TextInput from "./ui/TextInput";

const filterControlClasses = "w-full lg:w-auto";

interface EmployeeFilterBarProps {
  state: EmployeeFiltersState;
  departments: Department[];
  subDepartments: SubDepartment[];
  positions: Position[];
}

export default function EmployeeFilterBar({
  state,
  departments,
  subDepartments,
  positions,
}: EmployeeFilterBarProps) {
  const { departmentUniqueId, subDepartmentUniqueId, positionUniqueId } =
    state.filters;

  const visibleSubDepartments = departmentUniqueId
    ? subDepartments.filter(
        (subDepartment) =>
          subDepartment.departmentUniqueId === departmentUniqueId,
      )
    : subDepartments;

  const visiblePositions = positions.filter(
    (position) =>
      (!departmentUniqueId ||
        position.departmentUniqueId === departmentUniqueId) &&
      (!subDepartmentUniqueId ||
        position.subDepartmentUniqueId === subDepartmentUniqueId),
  );

  return (
    <div className="grid grid-cols-1 gap-3 border-b border-neutral-200 px-4 py-4 sm:grid-cols-2 sm:px-6 lg:flex lg:flex-wrap lg:items-start">
      <div className="flex flex-col gap-1">
        <TextInput
          variant="filter"
          className={filterControlClasses}
          type="search"
          aria-label="Search"
          value={state.searchInput}
          onChange={(e) => state.setSearchInput(e.target.value)}
          placeholder="Search name or email…"
        />
        {state.isSearchTooShort && (
          <span className="text-xs text-neutral-500">
            Type at least 3 characters
          </span>
        )}
      </div>

      <SelectInput
        variant="filter"
        className={filterControlClasses}
        aria-label="Department"
        value={departmentUniqueId ?? ""}
        onChange={(e) => state.setDepartment(e.target.value)}
      >
        <option value="">All departments</option>
        {departments.map((department) => (
          <option key={department.uniqueId} value={department.uniqueId}>
            {department.departmentName}
          </option>
        ))}
      </SelectInput>

      <SelectInput
        variant="filter"
        className={filterControlClasses}
        aria-label="Subdepartment"
        value={subDepartmentUniqueId ?? ""}
        onChange={(e) => state.setSubDepartment(e.target.value)}
      >
        <option value="">All subdepartments</option>
        {visibleSubDepartments.map((subDepartment) => (
          <option key={subDepartment.uniqueId} value={subDepartment.uniqueId}>
            {subDepartment.subDepartmentName}
          </option>
        ))}
      </SelectInput>

      <SelectInput
        variant="filter"
        className={filterControlClasses}
        aria-label="Position"
        value={positionUniqueId ?? ""}
        onChange={(e) => state.setPosition(e.target.value)}
      >
        <option value="">All positions</option>
        {visiblePositions.map((position) => (
          <option key={position.uniqueId} value={position.uniqueId}>
            {position.jobTitle}
          </option>
        ))}
      </SelectInput>

      {state.hasFilters && (
        <button
          type="button"
          onClick={state.clear}
          className="justify-self-start py-2 text-sm font-medium text-neutral-600 hover:text-black hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
