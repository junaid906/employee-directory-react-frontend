import { useEffect, useState } from "react";
import { Link } from "react-router";
import { listEmployees } from "../api/employees";
import type { Employee } from "../types/employee";

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
      setError("Could not load employees. Is the API running on http://localhost:5102?");
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
        if (!cancelled)
          setError("Could not load employees. Is the API running on http://localhost:5102?");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-neutral-500">Loading employees…</p>;
  }

  if (error) {
    return (
      <div className="rounded border border-neutral-300 bg-white p-4">
        <p className="text-black">{error}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-3 rounded bg-black px-4 py-2 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (employees.length === 0) {
    return <p className="text-neutral-500">No employees found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded border border-neutral-300 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-neutral-300 bg-neutral-100 text-black">
          <tr>
            <th className="px-4 py-3 font-medium">Employee</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Department</th>
            <th className="px-4 py-3 font-medium">Sub-department</th>
            <th className="px-4 py-3 font-medium">Job title</th>
            <th className="px-4 py-3 font-medium">Reports to</th>
            <th className="px-4 py-3 font-medium">Seat</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {employees.map((e) => (
            <tr key={e.id} className="hover:bg-neutral-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {e.avatarUrl ? (
                    <img
                      src={e.avatarUrl}
                      alt={`${e.firstName} ${e.lastName}`}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-xs font-medium text-neutral-600"
                    >
                      {e.firstName.charAt(0)}
                      {e.lastName.charAt(0)}
                    </span>
                  )}
                  <Link
                    to={`/employees/${e.id}`}
                    className="text-black underline underline-offset-2"
                  >
                    {e.firstName} {e.lastName}
                  </Link>
                </div>
              </td>
              <td className="px-4 py-3 text-neutral-700">{e.email}</td>
              <td className="px-4 py-3 text-neutral-700">{e.department}</td>
              <td className="px-4 py-3 text-neutral-700">{e.subDepartment}</td>
              <td className="px-4 py-3 text-neutral-700">{e.jobTitle}</td>
              <td className="px-4 py-3 text-neutral-700">{e.reportingTo ?? "—"}</td>
              <td className="px-4 py-3 text-neutral-700">
                {e.seatingPosition ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
