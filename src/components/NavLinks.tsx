import { Link } from "react-router";

interface NavLinksProps {
  className?: string;
  linkClassName?: string;
}

export default function NavLinks({
  className = "flex items-center gap-4 text-sm",
  linkClassName = "text-neutral-600 underline-offset-2 hover:underline",
}: NavLinksProps) {
  return (
    <nav className={className}>
      <Link to="/employees" className={linkClassName}>
        List
      </Link>
      <Link to="/org-chart" className={linkClassName}>
        Org chart
      </Link>
      <Link
        to="/employees/create"
        className="rounded bg-black px-3 py-1.5 font-medium text-white hover:bg-neutral-800"
      >
        Create Employee
      </Link>
    </nav>
  );
}
