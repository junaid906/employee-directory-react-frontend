import { BsDiagram3Fill } from "react-icons/bs";
import { FaList } from "react-icons/fa";
import { Link } from "react-router";

interface NavLinksProps {
  className?: string;
}

export default function NavLinks({
  className = "flex items-center gap-4 text-sm",
}: NavLinksProps) {
  return (
    <nav className={className}>
      <Link
        to="/employees"
        aria-label="Employees"
        className="flex gap-1 font-semibold"
      >
        <FaList className="my-auto" />
        <p>List</p>
      </Link>
      <Link
        to="/org-chart"
        aria-label="Org chart"
        className="flex gap-1 font-semibold"
      >
        <BsDiagram3Fill className="my-auto" />
        <p>Chart</p>
      </Link>
    </nav>
  );
}
