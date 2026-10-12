import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { auth } from "./userManager";

export function ProtectedRoute() {
  const [ready, setReady] = useState(false);
  const location = useLocation();

  useEffect(() => {
    auth.getUser().then((user) => {
      if (user && !user.expired) {
        setReady(true);
        return;
      }
      void auth.signinRedirect({
        state: { returnTo: location.pathname + location.search },
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready)
    return <div className="p-8 text-sm text-neutral-600">Signing in…</div>;
  return <Outlet />;
}
