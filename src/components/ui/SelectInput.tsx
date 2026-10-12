import type { SelectHTMLAttributes } from "react";
import { inputClasses } from "./formClasses";

export default function SelectInput({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`${inputClasses}${className ? ` ${className}` : ""}`}
      {...props}
    >
      {children}
    </select>
  );
}
