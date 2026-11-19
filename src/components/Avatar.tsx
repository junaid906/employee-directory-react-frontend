import { FiUser } from "react-icons/fi";
import { cx } from "../lib/cx";

interface AvatarProps {
  src?: string | null;
  firstName?: string;
  lastName?: string;
  placeholder?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-16 w-16 text-lg",
  lg: "h-20 w-20 text-xl",
};

const iconSizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

export default function Avatar({
  src,
  firstName = "",
  lastName = "",
  placeholder = false,
  size = "sm",
  className,
}: AvatarProps) {
  const baseClasses = cx("rounded-3xl", sizeClasses[size], className);
  const fallbackClasses = cx(
    "flex shrink-0 items-center justify-center bg-neutral-200",
    baseClasses,
  );

  if (placeholder) {
    return (
      <span aria-hidden className={cx("text-neutral-400", fallbackClasses)}>
        <FiUser className={iconSizeClasses[size]} />
      </span>
    );
  }

  if (src) {
    return (
      <img
        src={src}
        alt={`${firstName} ${lastName}`}
        className={cx("object-cover", baseClasses)}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cx("font-medium text-neutral-600", fallbackClasses)}
    >
      {firstName.charAt(0)}
      {lastName.charAt(0)}
    </span>
  );
}
