import type { ReactNode } from "react";
import { labelClasses } from "./formClasses";

interface FieldProps {
  htmlFor: string;
  label: string;
  required?: boolean;
  hint?: ReactNode;
  children: ReactNode;
}

export default function Field({
  htmlFor,
  label,
  required,
  hint,
  children,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClasses}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
    </div>
  );
}
