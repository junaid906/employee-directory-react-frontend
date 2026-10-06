import type { ReactNode } from "react";

interface PageCardProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function PageCard({ title, subtitle, action, children }: PageCardProps) {
  return (
    <div className="rounded border border-neutral-300 bg-white">
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <div>
            {title && <h1 className="text-xl font-semibold text-black">{title}</h1>}
            {subtitle && <p className="mt-0.5 text-sm text-neutral-500">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
