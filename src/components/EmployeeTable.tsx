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
            <th className="px-6 py-3 font-medium text-neutral-600">Employee</th>
            <th className="px-6 py-3 font-medium text-neutral-600">Email</th>
            <th className="px-6 py-3 font-medium text-neutral-600">Position</th>
            <th className="px-6 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {employees.map((employee) => {
            const position = positionMap[employee.positionUniqueId];
            const department = position
              ? departmentMap[position.departmentUniqueId]
              : undefined;
            return (
              <tr key={employee.uniqueId} className="hover:bg-neutral-50">
                <td className="px-6 py-4">
                  <Link
                    to={`/employees/${employee.uniqueId}`}
                    className="flex items-center gap-3 hover:bg-neutral-100"
                  >
                    <Avatar
                      src={employee.avatarUrl}
                      firstName={employee.firstName}
                      lastName={employee.lastName}
                      size="md"
                      className="rounded-4xl"
                    />
                    <span className="font-medium text-[17px] tracking-wide text-black">
                      {employee.firstName} {employee.lastName}
                    </span>
                  </Link>
                </td>
                <td className="px-6 py-4 text-neutral-600">
                  <a
                    href={`mailto:${employee.email}`}
                    className="inline-flex gap-1.5 hover:text-neutral-400"
                  >
                    {employee.email}
                    <LuMailPlus aria-hidden className="my-auto" />
                  </a>
                </td>
                <td className="px-6 py-4 text-neutral-600">
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
                <td className="px-6 py-4 text-right">
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
