import { Link, Navigate, Outlet, RouterProvider, createBrowserRouter } from "react-router";
import EmployeeDetailPage from "./pages/EmployeeDetailPage";
import EmployeeListPage from "./pages/EmployeeListPage";

function Layout() {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b border-neutral-300">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link to="/employees" className="text-lg font-semibold">
            Employee Directory
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Navigate to="/employees" replace /> },
      { path: "/employees", element: <EmployeeListPage /> },
      { path: "/employees/:id", element: <EmployeeDetailPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
