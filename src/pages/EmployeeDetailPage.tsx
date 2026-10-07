import { Link, useParams } from "react-router";
import { getEmployee } from "../api/employees";
import Avatar from "../components/Avatar";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import PageCard from "../components/PageCard";
import { useAsyncData } from "../hooks/useAsyncData";
import { EMPLOYEE_LOAD_ERROR } from "../lib/messages";

export default function EmployeeDetailPage() {
  const { id } = useParams();

  const {
    data: employee,
    loading,
    error,
  } = useAsyncData(id ?? "", () => getEmployee(id!), EMPLOYEE_LOAD_ERROR);

  if (loading) {
    return <LoadingState message="Loading employee…" />;
  }

  if (error || !employee) {
    return <ErrorState message={error ?? "Employee not found."} />;
  }

  const fields: Array<[string, string]> = [
    ["Email", employee.email],
    ["Position", employee.position.jobTitle],
    ["Department", employee.department.departmentName],
    ["Sub Department", employee.subDepartment?.subDepartmentName ?? "—"],
    ["Seating position", employee.position.seatingPosition.toString()],
  ];

  return (
    <PageCard
      title={`${employee.firstName} ${employee.lastName}`}
      subtitle="Employee"
      action={
        <Link
          to={`/org-chart?selected=${employee.position.uniqueId}`}
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
