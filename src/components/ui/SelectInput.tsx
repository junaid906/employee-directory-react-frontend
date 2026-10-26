import type { SelectHTMLAttributes } from "react";
import { FaChevronDown } from "react-icons/fa";
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
  const classes = variant === "filter" ? filterSelectClasses : selectClasses;

  return (
    <div className={`relative${variant === "default" ? " mt-1" : ""}`}>
      <select
        className={`${classes}${className ? ` ${className}` : ""}`}
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
