import type { SelectHTMLAttributes } from "react";
import { FaChevronDown } from "react-icons/fa";
import { cx } from "../../lib/cx";
import { filterSelectClasses, selectClasses } from "./formClasses";

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  variant?: "default" | "filter";
}

export default function SelectInput({
  variant = "default",
  className,
  children,
  ...props
}: SelectInputProps) {
  return (
    <div className={cx("relative", variant === "default" && "mt-1")}>
      <select
        className={cx(
          variant === "filter" ? filterSelectClasses : selectClasses,
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <FaChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-neutral-500"
      />
    </div>
  );
}
