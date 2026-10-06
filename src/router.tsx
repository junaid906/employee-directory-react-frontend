import {
  Navigate,
  createBrowserRouter,
} from "react-router";
import { Layout, BlankLayout } from "./components/Layout";
import RouteErrorPage from "./components/RouteErrorPage";
import CreateEmployeePage from "./pages/CreateEmployeePage";
import EmployeeDetailPage from "./pages/EmployeeDetailPage";
import EmployeeListPage from "./pages/EmployeeListPage";
import NotFoundPage from "./pages/NotFoundPage";
import OrgChartPage from "./pages/OrgChartPage";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <RouteErrorPage />,
    children: [
      { path: "/", element: <Navigate to="/employees" replace /> },
      { path: "/employees", element: <EmployeeListPage /> },
      { path: "/employees/create", element: <CreateEmployeePage /> },
      { path: "/employees/:id", element: <EmployeeDetailPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    element: <BlankLayout />,
    errorElement: <RouteErrorPage />,
    children: [{ path: "/org-chart", element: <OrgChartPage /> }],
  },
]);
