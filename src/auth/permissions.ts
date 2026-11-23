import { createContext, useContext } from "react";

interface Permissions {
  canEdit: boolean;
}

export const PermissionsContext = createContext<Permissions>({ canEdit: false });

export function useCanEdit(): boolean {
  return useContext(PermissionsContext).canEdit;
}
