import type { ReactNode } from "react";
import { Outlet } from "react-router";
import { RegularHeader } from "./Header";

interface LayoutProps {
  children?: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white text-black">
      <RegularHeader />
      <main>{children ?? <Outlet />}</main>
    </div>
  );
}

export function BlankLayout() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Outlet />
    </div>
  );
}
