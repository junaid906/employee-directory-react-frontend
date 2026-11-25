import { useEffect, useRef, useState } from "react";
import { auth } from "../../auth/userManager";
import AuthStatus from "../../components/AuthStatus";
import { buttonClasses } from "../../components/ui/buttonClasses";
import { SIGN_IN_FAILED_ERROR } from "../../lib/messages";

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
      <AuthStatus
        message={SIGN_IN_FAILED_ERROR}
        action={
          <a href="/" className={buttonClasses()}>
            Try again
          </a>
        }
      />
    );
  }

  return <AuthStatus message="Completing sign-in…" pending />;
}
