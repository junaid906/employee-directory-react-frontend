import type { InputHTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { filterInputClasses, inputClasses } from "./formClasses";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "filter";
}

export default function TextInput({
  variant = "default",
  className,
  ...props
}: TextInputProps) {
  return (
    <input
      className={cx(
        variant === "filter" ? filterInputClasses : inputClasses,
        className,
      )}
      {...props}
    />
  );
}
