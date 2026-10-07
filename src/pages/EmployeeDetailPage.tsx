import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getEmployee } from "../api/employees";
import type { Employee } from "../types/employee";
import Avatar from "../components/Avatar";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import PageCard from "../components/PageCard";

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      try {
        const data = await getEmployee(id!);
        if (cancelled) return;
        setEmployee(data);
      } catch {
        if (cancelled) setError("Could not load employee.");
      } finally {
        if (cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <LoadingState message="Loading employee…" />;
  }

  if (error || !employee) {
    return <ErrorState message={error ?? "Employee not found."} />;
  }

  const fields: Array<[string, string]> = [
    ["Email", employee.email],
    ["Seating position", employee.seatingPosition?.toString() ?? "—"],
  ];

  return (
    <PageCard
      title={`${employee.firstName} ${employee.lastName}`}
      subtitle="Employee"
      action={
        <Link
          to={`/org-chart?selected=${employee.uniqueId}`}
          className="rounded border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-50"
        >
          View in Org Chart
        </Link>
      }
    >
      <div className="p-6">
        <div className="flex items-start gap-6">
          <Avatar
            src={employee.avatarUrl}
            firstName={employee.firstName}
            lastName={employee.lastName}
            size="lg"
          />
          <dl className="grid flex-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            {fields.map(([label, value]) => (
              <div key={label} className="sm:col-span-1">
                <dt className="text-sm font-medium text-neutral-500">{label}</dt>
                <dd className="mt-1 text-sm text-black">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="border-t border-neutral-200 px-6 py-4">
        <Link
          to="/employees"
          className="text-sm font-medium text-black hover:underline"
        >
          ← Back to employees
        </Link>
      </div>
    </PageCard>
  );
}
