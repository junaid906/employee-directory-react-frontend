import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  deactivateEmployee,
  getPositions,
  listEmployees,
} from "../api/employees";
import type { Employee } from "../types/employee";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import EmployeeTable from "../components/EmployeeTable";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import PageCard from "../components/PageCard";
import { useAsyncData } from "../hooks/useAsyncData";
import {
  DEACTIVATE_EMPLOYEE_ERROR,
  EMPLOYEES_LOAD_ERROR,
} from "../lib/messages";

export default function EmployeeListPage() {
  const { data, loading, error, reload } = useAsyncData(
    "employees",
    () =>
      Promise.all([listEmployees(), getPositions()]).then(
        ([employees, positions]) => ({ employees, positions }),
      ),
    EMPLOYEES_LOAD_ERROR,
  );

  const employees = useMemo(() => data?.employees ?? [], [data]);
  const positions = useMemo(() => data?.positions ?? [], [data]);
  const positionMap = useMemo(
    () => Object.fromEntries(positions.map((p) => [p.uniqueId, p])),
    [positions],
  );

  console.log(employees[0]);

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
    } catch {
      setDeactivateError(DEACTIVATE_EMPLOYEE_ERROR);
    } finally {
      setIsDeactivating(false);
    }
  }

  if (loading) {
    return <LoadingState message="Loading employees…" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={reload} />;
  }

  return (
    <PageCard
      title="Employees"
      subtitle={`${employees.length} team member${employees.length !== 1 ? "s" : ""}`}
      action={
        <Link
          to="/employees/create"
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Add Employee
        </Link>
      }
    >
      {employees.length === 0 ? (
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
