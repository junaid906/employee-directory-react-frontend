import { Outlet } from "react-router";
import { RegularHeader } from "./Header";

export function Layout() {
  return (
    <div className="min-h-screen bg-white text-black">
      <RegularHeader />
      <main className="mx-auto">
        <Outlet />
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
