import type { ReactNode } from "react";
import { cx } from "../../lib/cx";

interface ErrorBannerProps {
  children: ReactNode;
  className?: string;
}

export default function ErrorBanner({ children, className }: ErrorBannerProps) {
  return (
    <div
      className={cx(
        "rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700",
        className,
      )}
    >
      {children}
    </div>
  );
}
