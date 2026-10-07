import { useEffect, useState } from "react";
import { Link } from "react-router";
import { listEmployees } from "../api/employees";
import type { Employee } from "../types/employee";
import Avatar from "../components/Avatar";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import PageCard from "../components/PageCard";

const LOAD_ERROR = "Could not load employees. Is the API running?";

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setEmployees(await listEmployees());
    } catch {
      setError(LOAD_ERROR);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    listEmployees()
      .then((data) => {
        if (!cancelled) setEmployees(data);
      })
      .catch(() => {
        if (!cancelled) setError(LOAD_ERROR);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <LoadingState message="Loading employees…" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={load} />;
  }

  return (
    <PageCard
      title="Employees"
      subtitle={`${employees.length} team member${employees.length !== 1 ? "s" : ""}`}
      action={
        <Link
          to="/employees/new"
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Add Employee
        </Link>
      }
    >
      {employees.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-neutral-500">No employees found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr>
                <th className="px-6 py-3 font-medium text-neutral-600">Employee</th>
                <th className="px-6 py-3 font-medium text-neutral-600">Email</th>
                <th className="px-6 py-3 font-medium text-neutral-600">Seat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {employees.map((e) => (
                <tr key={e.uniqueId} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <Link
                      to={`/employees/${e.uniqueId}`}
                      className="flex items-center gap-3 hover:bg-neutral-100"
                    >
                      <Avatar
                        src={e.avatarUrl}
                        firstName={e.firstName}
                        lastName={e.lastName}
                      />
                      <span className="font-medium text-black">
                        {e.firstName} {e.lastName}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{e.email}</td>
                  <td className="px-6 py-4 text-neutral-600">
                    {e.seatingPosition ?? <span className="text-neutral-400">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageCard>
  );
}
