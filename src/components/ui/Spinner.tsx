import { cx } from "../../lib/cx";

interface SpinnerProps {
  label?: string;
  className?: string;
}

export default function Spinner({ label = "Loading…", className }: SpinnerProps) {
  return (
    <span role="status" className={cx("inline-flex", className)}>
      <span
        aria-hidden
        className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-black"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
