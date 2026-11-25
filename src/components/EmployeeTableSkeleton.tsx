import { bodyCell, headCell } from "./EmployeeTable";

interface EmployeeTableSkeletonProps {
  rows?: number;
  showActions?: boolean;
}

const bar = "block h-3 rounded bg-neutral-200";

export default function EmployeeTableSkeleton({
  rows = 8,
  showActions = false,
}: EmployeeTableSkeletonProps) {
  return (
    <div className="overflow-x-auto" aria-busy="true">
      <span className="sr-only" role="status">
        Loading employees…
      </span>
      <table aria-hidden className="w-full text-left text-sm">
        <thead className="border-b border-neutral-200 bg-neutral-50">
          <tr>
            <th className={headCell}>Employee</th>
            <th className={`${headCell} hidden lg:table-cell`}>Email</th>
            <th className={`${headCell} hidden sm:table-cell`}>Position</th>
            {showActions && <th className={headCell} />}
          </tr>
        </thead>
        <tbody className="animate-pulse divide-y divide-neutral-100">
          {Array.from({ length: rows }, (_, index) => (
            <tr key={index}>
              <td className={bodyCell}>
                <span className="flex items-center gap-3 sm:gap-4">
                  <span className="h-8 w-8 shrink-0 rounded-3xl bg-neutral-200 sm:h-14 sm:w-14" />
                  <span className="flex min-w-0 flex-col gap-2">
                    <span className={`${bar} w-32 sm:h-4 sm:w-40`} />
                    <span className={`${bar} w-24 sm:hidden`} />
                  </span>
                </span>
              </td>
              <td className={`${bodyCell} hidden lg:table-cell`}>
                <span className={`${bar} w-48`} />
              </td>
              <td className={`${bodyCell} hidden sm:table-cell`}>
                <span className={`${bar} w-36`} />
              </td>
              {showActions && (
                <td className={`${bodyCell} text-right`}>
                  <span className="ml-auto block h-8 w-8 rounded-lg bg-neutral-200" />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
