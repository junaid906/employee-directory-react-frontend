import { useEffect, useRef } from "react";
import { auth } from "../../auth/userManager";

export default function CallbackPage() {
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;
    auth
      .signinRedirectCallback()
      .then((user) => {
        const state = user.state as { returnTo?: string } | undefined;
        window.location.replace(state?.returnTo ?? "/employees");
      })
      .catch(() => window.location.replace("/"));
  }, []);

  return (
    <div className="p-8 text-sm text-neutral-600">Completing sign-in…</div>
  );
}
