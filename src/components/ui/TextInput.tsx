import type { InputHTMLAttributes } from "react";
import { inputClasses } from "./formClasses";

export default function TextInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`${inputClasses}${className ? ` ${className}` : ""}`}
      {...props}
    />
  );
}
