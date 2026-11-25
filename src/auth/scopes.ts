import type { User } from "oidc-client-ts";

const WRITE_SCOPE = import.meta.env.VITE_AUTH_WRITE_SCOPE as string | undefined;

function readClaims(accessToken: string): Record<string, unknown> | null {
  try {
    const payload = accessToken.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const claims: unknown = JSON.parse(atob(padded));
    if (typeof claims !== "object" || claims === null) return null;
    return claims as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getScopes(accessToken: string): string[] {
  const scope = readClaims(accessToken)?.scope;
  return typeof scope === "string" ? scope.split(" ").filter(Boolean) : [];
}

export function canWrite(user: User | null): boolean {
  if (!user || user.expired || !WRITE_SCOPE) return false;
  return getScopes(user.access_token).includes(WRITE_SCOPE);
}
