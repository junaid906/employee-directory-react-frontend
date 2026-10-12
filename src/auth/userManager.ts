import { UserManager, WebStorageStateStore } from "oidc-client-ts";

export const auth = new UserManager({
  authority: import.meta.env.VITE_AUTH_AUTHORITY,
  client_id: import.meta.env.VITE_AUTH_CLIENT_ID,
  redirect_uri: `${window.location.origin}/callback`,
  post_logout_redirect_uri: `${window.location.origin}/`,
  response_type: "code",
  scope: import.meta.env.VITE_AUTH_SCOPE,
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
});
