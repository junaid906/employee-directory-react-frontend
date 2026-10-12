export type ButtonVariant = "primary" | "secondary";

const base =
  "rounded px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-black text-white hover:bg-neutral-800",
  secondary:
    "border border-neutral-300 bg-white text-black hover:bg-neutral-50",
};

export function buttonClasses(variant: ButtonVariant = "primary"): string {
  return `${base} ${variantClasses[variant]}`;
}
