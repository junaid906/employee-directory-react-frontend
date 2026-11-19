import { useEffect, useRef, useState } from "react";
import { auth } from "../../auth/userManager";

export default function CallbackPage() {
  const handled = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;
    auth
      .signinRedirectCallback()
      .then((user) => {
        const state = user.state as { returnTo?: string } | undefined;
        window.location.replace(state?.returnTo ?? "/employees");
      })
      .catch(() => setFailed(true));
  }, []);

  if (failed) {
    return (
      <div className="p-8 text-sm text-neutral-600">
        Sign-in failed.{" "}
        <a href="/" className="font-medium text-black underline">
          Try again
        </a>
      </div>
    );
  }

  return (
    <div className="p-8 text-sm text-neutral-600">Completing sign-in…</div>
  );
}
