import { Navigate, createBrowserRouter } from "react-router";
import { ProtectedRoute } from "./auth/protectedRoute";
import { RequireEditor } from "./auth/RequireEditor";
import { BlankLayout, Layout } from "./components/Layout";
import RouteErrorPage from "./components/RouteErrorPage";
import CallbackPage from "./pages/auth/CallbackPage";
import EmployeeDetailPage from "./pages/EmployeeDetailPage";
import EmployeeListPage from "./pages/EmployeeListPage";
import NotFoundPage from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/callback",
    element: <CallbackPage />,
    errorElement: <RouteErrorPage />,
  },
  {
    element: <ProtectedRoute />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: "/", element: <Navigate to="/employees" replace /> },
          { path: "/employees", element: <EmployeeListPage /> },
          { path: "/employees/:id", element: <EmployeeDetailPage /> },
          {
            element: <RequireEditor />,
            children: [
              {
                path: "/employees/create",
                lazy: async () => ({
                  Component: (await import("./pages/CreateEmployeePage"))
                    .default,
                }),
              },
              {
                path: "/positions/create",
                lazy: async () => ({
                  Component: (await import("./pages/CreatePositionPage"))
                    .default,
                }),
              },
              {
                path: "/positions/:id/edit",
                lazy: async () => ({
                  Component: (await import("./pages/EditPositionPage")).default,
                }),
              },
            ],
          },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
      {
        element: <BlankLayout />,
        children: [
          {
            path: "/org-chart",
            lazy: async () => ({
              Component: (await import("./pages/OrgChartPage")).default,
            }),
          },
        ],
      },
    ],
  },
]);
