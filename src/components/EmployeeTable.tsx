import { Link } from "react-router";
import type { Department } from "../types/department";
import type { Employee } from "../types/employee";
import type { Position } from "../types/position";
import Avatar from "./Avatar";
import DepartmentIcon from "./DepartmentIcon";
import { LuMailPlus, LuUserX } from "react-icons/lu";

interface EmployeeTableProps {
  employees: Employee[];
  positionMap: Record<string, Position>;
  departmentMap: Record<string, Department>;
  onDeactivate: (employee: Employee) => void;
}

const headCell =
  "px-4 py-3 text-xs font-medium uppercase tracking-wider text-neutral-500 sm:px-6";
const bodyCell = "px-4 py-3 sm:px-6 sm:py-4";

export default function EmployeeTable({
  employees,
  positionMap,
  departmentMap,
  onDeactivate,
}: EmployeeTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-neutral-200 bg-neutral-50">
          <tr>
            <th className={headCell}>Employee</th>
            <th className={`${headCell} hidden lg:table-cell`}>Email</th>
            <th className={`${headCell} hidden sm:table-cell`}>Position</th>
            <th className={headCell}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {employees.map((employee) => {
            const position = positionMap[employee.positionUniqueId];
            const department = position
              ? departmentMap[position.departmentUniqueId]
              : undefined;
            return (
              <tr
                key={employee.uniqueId}
                className="group transition-colors hover:bg-neutral-50"
              >
                <td className={bodyCell}>
                  <Link
                    to={`/employees/${employee.uniqueId}`}
                    className="flex items-center gap-3 sm:gap-4"
                  >
                    <Avatar
                      src={employee.avatarUrl}
                      firstName={employee.firstName}
                      lastName={employee.lastName}
                      size="sm"
                      className="sm:h-14 sm:w-14 sm:text-base"
                    />
                    <span className="min-w-0">
                      <span className="block whitespace-nowrap text-base font-medium text-black group-hover:underline">
                        {employee.firstName} {employee.lastName}
                      </span>
                      {position && (
                        <span className="block truncate text-sm text-neutral-500 sm:hidden">
                          {position.jobTitle}
                        </span>
                      )}
                    </span>
                  </Link>
                </td>
                <td className={`${bodyCell} hidden text-neutral-600 lg:table-cell`}>
                  <a
                    href={`mailto:${employee.email}`}
                    className="inline-flex items-center gap-1.5 hover:text-black"
                  >
                    {employee.email}
                    <LuMailPlus aria-hidden />
                  </a>
                </td>
                <td className={`${bodyCell} hidden text-neutral-600 sm:table-cell`}>
                  {position ? (
                    <span className="inline-flex items-center gap-1.5">
                      {position.jobTitle}
                      {department && (
                        <DepartmentIcon
                          departmentName={department.departmentName}
                        />
                      )}
                    </span>
                  ) : (
                    <span className="text-neutral-400">—</span>
                  )}
                </td>
                <td className={`${bodyCell} text-right`}>
                  <button
                    type="button"
                    onClick={() => onDeactivate(employee)}
                    aria-label={`Deactivate ${employee.firstName} ${employee.lastName}`}
                    className="cursor-pointer rounded-lg bg-red-600 p-2 text-sm font-medium text-white hover:bg-red-500"
                  >
                    <LuUserX aria-hidden />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
