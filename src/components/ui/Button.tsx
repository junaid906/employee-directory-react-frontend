import type { ButtonHTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { buttonClasses, type ButtonVariant } from "./buttonClasses";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export default function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(buttonClasses(variant), className)}
      {...props}
    />
  );
}
