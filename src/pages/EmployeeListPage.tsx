import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  deactivateEmployee,
  listEmployees,
} from "../api/employees";
import type { Employee, EmployeeFilters } from "../types/employee";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import EmployeeTable from "../components/EmployeeTable";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import PageCard from "../components/PageCard";
import { useAsyncData } from "../hooks/useAsyncData";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useReferenceData } from "../hooks/useReferenceData";
import { getProblemDetailsMessage } from "../lib/apiError";
import { buttonClasses } from "../components/ui/buttonClasses";
import { filterInputClasses } from "../components/ui/formClasses";
import {
  DEACTIVATE_EMPLOYEE_ERROR,
  EMPLOYEES_LOAD_ERROR,
} from "../lib/messages";

export default function EmployeeListPage() {
  const [filters, setFilters] = useState<EmployeeFilters>({});
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, 300);
  const [appliedSearch, setAppliedSearch] = useState("");

  const trimmedSearch = debouncedSearch.trim();
  if (
    trimmedSearch !== appliedSearch &&
    (trimmedSearch.length === 0 || trimmedSearch.length >= 3)
  ) {
    setAppliedSearch(trimmedSearch);
  }

  const query = useMemo<EmployeeFilters>(() => {
    const q: EmployeeFilters = { ...filters };
    if (appliedSearch) q.search = appliedSearch;
    else delete q.search;
    return q;
  }, [filters, appliedSearch]);

  const { data: referenceData } = useReferenceData();

  const { data: employeeData, loading, error, reload } = useAsyncData(
    `employees:${JSON.stringify(query)}`,
    () => listEmployees(query),
    EMPLOYEES_LOAD_ERROR,
  );

  const employees = useMemo(() => employeeData ?? [], [employeeData]);
  const positions = useMemo(
    () => referenceData?.positions ?? [],
    [referenceData],
  );
  const departments = useMemo(
    () => referenceData?.departments ?? [],
    [referenceData],
  );
  const subDepartments = useMemo(
    () => referenceData?.subDepartments ?? [],
    [referenceData],
  );
  const positionMap = useMemo(
    () => Object.fromEntries(positions.map((p) => [p.uniqueId, p])),
    [positions],
  );

  const visibleSubDepartments = useMemo(
    () =>
      filters.departmentUniqueId
        ? subDepartments.filter(
            (subDepartment) =>
              subDepartment.departmentUniqueId === filters.departmentUniqueId,
          )
        : subDepartments,
    [subDepartments, filters.departmentUniqueId],
  );

  const visiblePositions = useMemo(
    () =>
      positions.filter(
        (position) =>
          (!filters.departmentUniqueId ||
            position.departmentUniqueId === filters.departmentUniqueId) &&
          (!filters.subDepartmentUniqueId ||
            position.subDepartmentUniqueId === filters.subDepartmentUniqueId),
      ),
    [positions, filters.departmentUniqueId, filters.subDepartmentUniqueId],
  );

  function handleDepartmentChange(value: string) {
    setFilters((prev) => ({
      ...prev,
      departmentUniqueId: value,
      subDepartmentUniqueId: "",
      positionUniqueId: "",
    }));
  }

  function handleSubDepartmentChange(value: string) {
    setFilters((prev) => ({
      ...prev,
      subDepartmentUniqueId: value,
      positionUniqueId: "",
    }));
  }

  function handlePositionChange(value: string) {
    setFilters((prev) => ({ ...prev, positionUniqueId: value }));
  }

  const hasFilters =
    Object.values(filters).some(
      (value) => value !== undefined && value !== "",
    ) || searchInput.trim().length > 0;

  const [deactivateTarget, setDeactivateTarget] = useState<Employee | null>(
    null,
  );
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [deactivateError, setDeactivateError] = useState<string | null>(null);

  function requestDeactivate(employee: Employee) {
    setDeactivateError(null);
    setDeactivateTarget(employee);
  }

  function cancelDeactivate() {
    if (isDeactivating) return;
    setDeactivateTarget(null);
    setDeactivateError(null);
  }

  async function confirmDeactivate() {
    if (!deactivateTarget) return;
    setIsDeactivating(true);
    setDeactivateError(null);
    try {
      await deactivateEmployee(deactivateTarget.uniqueId);
      setDeactivateTarget(null);
      reload();
    } catch (error) {
      setDeactivateError(
        getProblemDetailsMessage(error, DEACTIVATE_EMPLOYEE_ERROR),
      );
    } finally {
      setIsDeactivating(false);
    }
  }

  return (
    <PageCard
      title="Employees"
      subtitle={`${employees.length} team member${employees.length !== 1 ? "s" : ""}`}
      action={
        <Link
          to="/employees/create"
          className={buttonClasses("primary")}
        >
          Add Employee
        </Link>
      }
    >
      <div className="flex flex-wrap items-center gap-3 border-b border-neutral-200 px-6 py-4">
        <div className="flex flex-col gap-1">
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name or email…"
            className={filterInputClasses}
          />
          {searchInput.trim().length > 0 && searchInput.trim().length < 3 && (
            <span className="text-xs text-neutral-500">
              Type at least 3 characters
            </span>
          )}
        </div>

        <select
          aria-label="Department"
          value={filters.departmentUniqueId ?? ""}
          onChange={(e) => handleDepartmentChange(e.target.value)}
          className={filterInputClasses}
        >
          <option value="">All departments</option>
          {departments.map((department) => (
            <option key={department.uniqueId} value={department.uniqueId}>
              {department.departmentName}
            </option>
          ))}
        </select>

        <select
          aria-label="Subdepartment"
          value={filters.subDepartmentUniqueId ?? ""}
          onChange={(e) => handleSubDepartmentChange(e.target.value)}
          className={filterInputClasses}
        >
          <option value="">All subdepartments</option>
          {visibleSubDepartments.map((subDepartment) => (
            <option key={subDepartment.uniqueId} value={subDepartment.uniqueId}>
              {subDepartment.subDepartmentName}
            </option>
          ))}
        </select>

        <select
          aria-label="Position"
          value={filters.positionUniqueId ?? ""}
          onChange={(e) => handlePositionChange(e.target.value)}
          className={filterInputClasses}
        >
          <option value="">All positions</option>
          {visiblePositions.map((position) => (
            <option key={position.uniqueId} value={position.uniqueId}>
              {position.jobTitle}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setFilters({});
              setSearchInput("");
            }}
            className="text-sm font-medium text-neutral-600 hover:text-black hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="px-6 py-12">
          <LoadingState message="Loading employees…" />
        </div>
      ) : error ? (
        <div className="px-6 py-12">
          <ErrorState message={error} onRetry={reload} />
        </div>
      ) : employees.length === 0 ? (
        <EmptyState message="No employees found." />
      ) : (
        <EmployeeTable
          employees={employees}
          positionMap={positionMap}
          onDeactivate={requestDeactivate}
        />
      )}

      <ConfirmDialog
        open={deactivateTarget !== null}
        title="Deactivate employee"
        message={
          deactivateTarget
            ? `Another one bites the dust! We wish ${deactivateTarget.firstName} ${deactivateTarget.lastName} well!`
            : ""
        }
        confirmLabel="Deactivate"
        confirmingLabel="Deactivating…"
        isConfirming={isDeactivating}
        error={deactivateError}
        onConfirm={confirmDeactivate}
        onCancel={cancelDeactivate}
      />
    </PageCard>
  );
}
