import { Link } from "react-router";
import NavLinks from "./NavLinks";

interface RegularHeaderProps {
  brandLink?: string;
}

export function RegularHeader({
  brandLink = "/employees",
}: RegularHeaderProps) {
  return (
    <header className="border-b border-neutral-300">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link
          to={brandLink}
          className="text-lg font-semibold transition-opacity hover:opacity-70"
        >
          WBWR Directory
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}

export function FloatingHeader() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-3 z-50">
      <nav className="mx-auto flex h-14 items-center justify-center px-4 py-3 sm:py-4">
        <div className="pointer-events-auto rounded-xs bg-white/80 px-4 py-2 shadow-lg backdrop-blur-sm sm:px-6 sm:py-2">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/employees"
              className="text-base font-semibold transition-opacity hover:opacity-70 sm:text-lg"
            >
              WBWR Directory
            </Link>
            <NavLinks
              linkClassName="text-neutral-600 underline-offset-2 hover:underline"
              className="flex items-center gap-2 text-sm sm:gap-4"
            />
          </div>
        </div>
      </nav>
    </header>
  );
}
