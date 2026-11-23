import { useMemo } from "react";
import { Link } from "react-router";
import { listEmployees } from "../api/employees";
import ConfirmDialog from "../components/ConfirmDialog";
import EmployeeFilterBar from "../components/EmployeeFilterBar";
import EmployeeTable from "../components/EmployeeTable";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import PageCard from "../components/PageCard";
import { buttonClasses } from "../components/ui/buttonClasses";
import { useAsyncData } from "../hooks/useAsyncData";
import { useDeactivateEmployee } from "../hooks/useDeactivateEmployee";
import { useEmployeeFilters } from "../hooks/useEmployeeFilters";
import { useReferenceData } from "../hooks/useReferenceData";
import { EMPLOYEES_LOAD_ERROR } from "../lib/messages";

function byUniqueId<T extends { uniqueId: string }>(
  items: T[] = [],
): Record<string, T> {
  return Object.fromEntries(items.map((item) => [item.uniqueId, item]));
}

export default function EmployeeListPage() {
  const filterState = useEmployeeFilters();
  const { query } = filterState;
  const { data: referenceData } = useReferenceData();

  const {
    data: employeeData,
    loading,
    error,
    reload,
  } = useAsyncData(
    `employees:${JSON.stringify(query)}`,
    () => listEmployees(query),
    EMPLOYEES_LOAD_ERROR,
  );

  const deactivate = useDeactivateEmployee(reload);

  const positionMap = useMemo(
    () => byUniqueId(referenceData?.positions),
    [referenceData],
  );
  const departmentMap = useMemo(
    () => byUniqueId(referenceData?.departments),
    [referenceData],
  );

  const employees = employeeData ?? [];

  return (
    <PageCard
      title="Employees"
      subtitle={`${employees.length} team member${employees.length !== 1 ? "s" : ""}`}
      action={
        <Link to="/employees/create" className={buttonClasses("primary")}>
          Add Employee
        </Link>
      }
    >
      <EmployeeFilterBar
        state={filterState}
        departments={referenceData?.departments ?? []}
        subDepartments={referenceData?.subDepartments ?? []}
        positions={referenceData?.positions ?? []}
      />

      {loading ? (
        <div className="px-4 py-12 sm:px-6">
          <LoadingState message="Loading employees…" />
        </div>
      ) : error ? (
        <div className="px-4 py-12 sm:px-6">
          <ErrorState message={error} onRetry={reload} />
        </div>
      ) : employees.length === 0 ? (
        <EmptyState message="No employees found." />
      ) : (
        <EmployeeTable
          employees={employees}
          positionMap={positionMap}
          departmentMap={departmentMap}
          onDeactivate={deactivate.request}
        />
      )}

      <ConfirmDialog
        open={deactivate.target !== null}
        title="Deactivate employee"
        message={
          deactivate.target
            ? `Are you sure you want to deactivate ${deactivate.target.firstName} ${deactivate.target.lastName}?`
            : ""
        }
        confirmLabel="Deactivate"
        confirmingLabel="Deactivating…"
        isConfirming={deactivate.submitting}
        error={deactivate.error}
        onConfirm={deactivate.confirm}
        onCancel={deactivate.cancel}
      />
    </PageCard>
  );
}
