import {
  Link,
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useRouteError,
} from "react-router";
import EmployeeDetailPage from "./pages/EmployeeDetailPage";
import EmployeeListPage from "./pages/EmployeeListPage";
import NotFoundPage from "./pages/NotFoundPage";
import OrgChartPage from "./pages/OrgChartPage";

function Header() {
  return (
    <header className="border-b border-neutral-300">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link to="/employees" className="text-lg font-semibold">
          Employee Directory
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            to="/employees"
            className="text-neutral-600 underline-offset-2 hover:underline"
          >
            List
          </Link>
          <Link
            to="/org-chart"
            className="text-neutral-600 underline-offset-2 hover:underline"
          >
            Org chart
          </Link>
        </nav>
      </div>
    </header>
  );
}

function RouteErrorPage() {
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <main className="mx-auto ">
        <div className="rounded border border-neutral-300 bg-white p-6">
          <p className="text-sm font-medium text-neutral-500">Error</p>
          <h1 className="mt-1 text-xl font-semibold text-black">
            Something went wrong
          </h1>
          <p className="mt-2 text-neutral-600">
            An unexpected error occurred while rendering this page.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block bg-black px-4 py-2 text-white"
          >
            Back to homepage
          </Link>
          {error instanceof Error ? (
            <p className="mt-4 rounded border border-neutral-300 bg-neutral-100 p-3 font-mono text-sm text-neutral-700">
              {error.message}
            </p>
          ) : null}
        </div>
      </main>
    </div>
  );
}

function Layout() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <main className="mx-auto ">
        <Outlet />
      </main>
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <RouteErrorPage />,
    children: [
      { path: "/", element: <Navigate to="/employees" replace /> },
      { path: "/employees", element: <EmployeeListPage /> },
      { path: "/employees/:id", element: <EmployeeDetailPage /> },
      { path: "/org-chart", element: <OrgChartPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
