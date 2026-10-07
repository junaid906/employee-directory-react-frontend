import { FiUser } from "react-icons/fi";

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
  className = "",
}: AvatarProps) {
  if (placeholder) {
    return (
      <span
        aria-hidden
        className={`flex shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-400 ${sizeClasses[size]} ${className}`}
      >
        <FiUser className={iconSizeClasses[size]} />
      </span>
    );
  }

  if (src) {
    return (
      <img
        src={src}
        alt={`${firstName} ${lastName}`}
        className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
      />
    );
  }

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full bg-neutral-200 font-medium text-neutral-600 ${sizeClasses[size]} ${className}`}
    >
      {initials}
    </span>
  );
}
