import type { User } from "oidc-client-ts";

export const EDITOR_ROLES: readonly string[] = ["PlatformAdmin", "Admin"];

export function getRole(accessToken: string): string | null {
  try {
    const payload = accessToken.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const claims: unknown = JSON.parse(atob(padded));
    if (typeof claims !== "object" || claims === null) return null;
    const role = (claims as Record<string, unknown>).role;
    return typeof role === "string" ? role : null;
  } catch {
    return null;
  }
}

export function isEditor(user: User | null): boolean {
  if (!user || user.expired) return false;
  const role = getRole(user.access_token);
  return role !== null && EDITOR_ROLES.includes(role);
}
