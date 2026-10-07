import { Link } from "react-router";
import type { Employee, Position } from "../types/employee";
import Avatar from "./Avatar";

interface EmployeeTableProps {
  employees: Employee[];
  positionMap: Record<string, Position>;
  onDeactivate: (employee: Employee) => void;
}

export default function EmployeeTable({
  employees,
  positionMap,
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
                    />
                    <span className="font-medium text-black">
                      {employee.firstName} {employee.lastName}
                    </span>
                  </Link>
                </td>
                <td className="px-6 py-4 text-neutral-600">{employee.email}</td>
                <td className="px-6 py-4 text-neutral-600">
                  {position ? (
                    <span>{position.jobTitle}</span>
                  ) : (
                    <span className="text-neutral-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onDeactivate(employee)}
                    className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline"
                  >
                    Deactivate
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
