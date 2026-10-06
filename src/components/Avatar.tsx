interface AvatarProps {
  src?: string | null;
  firstName: string;
  lastName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-16 w-16 text-lg",
  lg: "h-20 w-20 text-xl",
};

export default function Avatar({
  src,
  firstName,
  lastName,
  size = "sm",
  className = "",
}: AvatarProps) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

  if (src) {
    return (
      <img
        src={src}
        alt={`${firstName} ${lastName}`}
        className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full bg-neutral-200 font-medium text-neutral-600 ${sizeClasses[size]} ${className}`}
    >
      {initials}
    </span>
  );
}
