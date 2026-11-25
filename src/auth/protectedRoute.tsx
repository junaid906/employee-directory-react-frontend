import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import AuthStatus from "../components/AuthStatus";
import { buttonClasses } from "../components/ui/buttonClasses";
import { SIGN_IN_SERVICE_ERROR } from "../lib/messages";
import { PermissionsContext } from "./permissions";
import { canWrite } from "./scopes";
import { auth, authEnabled } from "./userManager";

type SignInState = "checking" | "signed-in" | "failed";

export function ProtectedRoute() {
  const [status, setStatus] = useState<SignInState>(
    authEnabled ? "checking" : "signed-in",
  );
  const [canEdit, setCanEdit] = useState(authEnabled);

  useEffect(() => {
    if (!authEnabled) return;
    auth
      .getUser()
      .then((user) => {
        if (user && !user.expired) {
          setCanEdit(canWrite(user));
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
      <AuthStatus
        message={SIGN_IN_SERVICE_ERROR}
        action={
          <button
            type="button"
            onClick={() => window.location.reload()}
            className={buttonClasses()}
          >
            Try again
          </button>
        }
      />
    );
  }

  if (status === "checking") {
    return <AuthStatus message="Signing in…" pending />;
  }

  return (
    <PermissionsContext.Provider value={{ canEdit }}>
      <Outlet />
    </PermissionsContext.Provider>
  );
}
