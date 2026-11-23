import { Link, useParams } from "react-router";
import { getEmployee } from "../api/employees";
import Avatar from "../components/Avatar";
import ErrorState from "../components/ErrorState";
import FloorPlan from "../components/FloorPlan";
import LoadingState from "../components/LoadingState";
import PageCard from "../components/PageCard";
import { buttonClasses } from "../components/ui/buttonClasses";
import { useAsyncData } from "../hooks/useAsyncData";
import { EMPLOYEE_LOAD_ERROR } from "../lib/messages";
import { SEATING_MAP } from "../lib/seating";

export default function EmployeeDetailPage() {
  const { id } = useParams();

  const {
    data: employee,
    loading,
    error,
  } = useAsyncData(id ?? "", () => getEmployee(id!), EMPLOYEE_LOAD_ERROR);

  if (loading) {
    return (
      <PageCard>
        <div className="px-4 py-12 sm:px-6">
          <LoadingState message="Loading employee…" />
        </div>
      </PageCard>
    );
  }

  if (error || !employee) {
    return (
      <PageCard>
        <div className="px-4 py-12 sm:px-6">
          <ErrorState message={error ?? "Employee not found."} />
        </div>
      </PageCard>
    );
  }

  const fields: Array<[string, string]> = [
    ["Email", employee.email],
    ["Position", employee.position.jobTitle],
    ["Department", employee.department.departmentName],
    ["Sub Department", employee.subDepartment?.subDepartmentName ?? "—"],
  ];

  const seat = SEATING_MAP[employee.position.seatingPosition];

  return (
    <PageCard
      title={`${employee.firstName} ${employee.lastName}`}
      subtitle="Employee"
      action={
        <Link
          to={`/org-chart?selected=${employee.position.uniqueId}`}
          className={buttonClasses("secondary")}
        >
          View in Org Chart
        </Link>
      }
    >
      <div className="p-4 sm:p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <Avatar
            src={employee.avatarUrl}
            firstName={employee.firstName}
            lastName={employee.lastName}
            size="lg"
          />
          <dl className="grid min-w-0 flex-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            {fields.map(([label, value]) => (
              <div key={label} className="min-w-0">
                <dt className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  {label}
                </dt>
                <dd className="mt-1 break-words text-base text-black">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {seat && (
          <div className="mt-6">
            <FloorPlan seat={seat} />
          </div>
        )}
      </div>
      <div className="border-t border-neutral-200 px-4 py-4 sm:px-6">
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
