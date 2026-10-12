import { Navigate, createBrowserRouter } from "react-router";
import { Layout, BlankLayout } from "./components/Layout";
import RouteErrorPage from "./components/RouteErrorPage";
import CreateEmployeePage from "./pages/CreateEmployeePage";
import CreatePositionPage from "./pages/CreatePositionPage";
import EditPositionPage from "./pages/EditPositionPage";
import EmployeeDetailPage from "./pages/EmployeeDetailPage";
import EmployeeListPage from "./pages/EmployeeListPage";
import NotFoundPage from "./pages/NotFoundPage";
import OrgChartPage from "./pages/OrgChartPage";
import CallbackPage from "./pages/auth/CallbackPage";
import { ProtectedRoute } from "./auth/protectedRoute";

export const router = createBrowserRouter([
  {
    path: "/callback",
    element: <CallbackPage />,
    errorElement: <RouteErrorPage />,
  },
  {
    element: <ProtectedRoute />,
    errorElement: <RouteErrorPage />,
    children: [],
  },
  {
    element: <Layout />,
    errorElement: <RouteErrorPage />,
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
    errorElement: <RouteErrorPage />,
    children: [{ path: "/org-chart", element: <OrgChartPage /> }],
  },
]);
