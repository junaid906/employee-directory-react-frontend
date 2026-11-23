import { Navigate, Outlet } from "react-router";
import { useCanEdit } from "./permissions";

export function RequireEditor() {
  const canEdit = useCanEdit();
  return canEdit ? <Outlet /> : <Navigate to="/employees" replace />;
}
