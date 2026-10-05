import { useEffect, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router";
import { getEmployee } from "../api/employees";
import type { Employee } from "../types/employee";

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [manager, setManager] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getEmployee(id)
      .then((data) => {
        if (cancelled) return;
        setEmployee(data);
        if (data.reportingToUniqueId) {
          getEmployee(data.reportingToUniqueId)
            .then((m) => {
              if (!cancelled) setManager(m);
            })
            .catch(() => {
              if (!cancelled) setManager(null);
            });
        }
      })
      .catch(() => {
        if (!cancelled) setError("Could not load employee.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <p className="text-neutral-500">Loading employee…</p>;
  }

  if (error || !employee) {
    return (
      <div className="rounded border border-neutral-300 bg-white p-4">
        <p className="text-black">{error ?? "Employee not found."}</p>
        <Link
          to="/employees"
          className="mt-2 inline-block text-black underline underline-offset-2"
        >
          Back to employees
        </Link>
      </div>
    );
  }

  const reportsTo =
    manager ? (
      <Link
        to={`/employees/${manager.uniqueId}`}
        className="text-black underline underline-offset-2"
      >
        {manager.firstName} {manager.lastName}
      </Link>
    ) : employee.reportingToUniqueId ? (
      employee.reportingToUniqueId
    ) : (
      "—"
    );

  const fields: Array<[string, ReactNode]> = [
    ["Email", employee.email],
    ["Department", employee.department],
    ["Sub-department", employee.subDepartment],
    ["Job title", employee.jobTitle],
    ["Reports to", reportsTo],
    ["Seating position", employee.seatingPosition?.toString() ?? "—"],
  ];

  return (
    <div className="rounded border border-neutral-300 bg-white p-6">
      <div className="flex items-center gap-4">
        {employee.avatarUrl ? (
          <img
            src={employee.avatarUrl}
            alt={`${employee.firstName} ${employee.lastName}`}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-200 text-lg font-medium text-neutral-600"
          >
            {employee.firstName.charAt(0)}
            {employee.lastName.charAt(0)}
          </span>
        )}
        <div>
          <h1 className="text-xl font-semibold text-black">
            {employee.firstName} {employee.lastName}
          </h1>
          <p className="text-sm text-neutral-500">{employee.jobTitle}</p>
        </div>
      </div>

      <dl className="mt-6 divide-y divide-neutral-200 text-sm">
        {fields.map(([label, value]) => (
          <div key={label} className="grid grid-cols-3 gap-4 py-2">
            <dt className="font-medium text-black">{label}</dt>
            <dd className="col-span-2 text-neutral-700">{value}</dd>
          </div>
        ))}
      </dl>

      <Link
        to="/employees"
        className="mt-4 inline-block text-black underline underline-offset-2"
      >
        Back to employees
      </Link>
    </div>
  );
}
