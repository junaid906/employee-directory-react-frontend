import { BsDiagram3Fill } from "react-icons/bs";
import { FaList } from "react-icons/fa";
import { Link } from "react-router";

interface NavLinksProps {
  className?: string;
}

const iconLinkClasses = "block rounded-sm bg-black p-1 text-white";

export default function NavLinks({
  className = "flex items-center gap-4 text-sm",
}: NavLinksProps) {
  return (
    <nav className={className}>
      <Link to="/employees" aria-label="Employees" className={iconLinkClasses}>
        <FaList />
      </Link>
      <Link to="/org-chart" aria-label="Org chart" className={iconLinkClasses}>
        <BsDiagram3Fill />
      </Link>
    </nav>
  );
}
