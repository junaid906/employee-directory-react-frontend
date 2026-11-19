import { Navigate, createBrowserRouter } from "react-router";
import { ProtectedRoute } from "./auth/protectedRoute";
import { BlankLayout, Layout } from "./components/Layout";
import RouteErrorPage from "./components/RouteErrorPage";
import CallbackPage from "./pages/auth/CallbackPage";
import CreateEmployeePage from "./pages/CreateEmployeePage";
import CreatePositionPage from "./pages/CreatePositionPage";
import EditPositionPage from "./pages/EditPositionPage";
import EmployeeDetailPage from "./pages/EmployeeDetailPage";
import EmployeeListPage from "./pages/EmployeeListPage";
import NotFoundPage from "./pages/NotFoundPage";
import OrgChartPage from "./pages/OrgChartPage";

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
          { path: "/employees/create", element: <CreateEmployeePage /> },
          { path: "/employees/:id", element: <EmployeeDetailPage /> },
          { path: "/positions/create", element: <CreatePositionPage /> },
          { path: "/positions/:id/edit", element: <EditPositionPage /> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
      {
        element: <BlankLayout />,
        children: [{ path: "/org-chart", element: <OrgChartPage /> }],
      },
    ],
  },
]);
