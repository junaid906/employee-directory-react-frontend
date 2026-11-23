import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { PermissionsContext } from "./permissions";
import { isEditor } from "./roles";
import { auth, authEnabled } from "./userManager";

type AuthStatus = "checking" | "signed-in" | "failed";

export function ProtectedRoute() {
  const [status, setStatus] = useState<AuthStatus>(
    authEnabled ? "checking" : "signed-in",
  );
  const [canEdit, setCanEdit] = useState(authEnabled);

  useEffect(() => {
    if (!authEnabled) return;
    auth
      .getUser()
      .then((user) => {
        if (user && !user.expired) {
          setCanEdit(isEditor(user));
          setStatus("signed-in");
          return;
        }
        return auth.signinRedirect({
          state: {
            returnTo: window.location.pathname + window.location.search,
          },
        });
      })
      .catch(() => setStatus("failed"));
  }, []);

  if (status === "failed") {
    return (
      <div className="p-8 text-sm text-neutral-600">
        Could not reach the sign-in service.{" "}
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="font-medium text-black underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (status === "checking") {
    return <div className="p-8 text-sm text-neutral-600">Signing in…</div>;
  }

  return (
    <PermissionsContext.Provider value={{ canEdit }}>
      <Outlet />
    </PermissionsContext.Provider>
  );
}
