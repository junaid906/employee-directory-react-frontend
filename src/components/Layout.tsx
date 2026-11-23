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
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        {children ?? <Outlet />}
      </main>
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
