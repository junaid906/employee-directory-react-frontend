# WhereWiser

The front end for the company employee directory. Browse employees, see the org chart, find where people sit, and (with write access) manage employees and positions.

Built with React 19, TypeScript, Vite, Tailwind CSS 4, React Router and React Flow. Sign-in uses OpenID Connect via `oidc-client-ts`.

## Features

| Route | What it does | Access |
| --- | --- | --- |
| `/employees` | Searchable, filterable employee list | Signed in |
| `/employees/:id` | Employee details, including their seat on the floor plan | Signed in |
| `/org-chart` | Interactive org chart; expand/collapse branches, `?selected=<positionId>` deep-links to a position | Signed in |
| `/employees/create` | Multi-step wizard to add an employee | Write scope |
| `/positions/create`, `/positions/:id/edit` | Create, edit and re-parent positions | Write scope |
| `/callback` | OIDC sign-in redirect target | Public |

Users without the write scope can view everything but don't see the edit actions, and are redirected away from the editor routes.

## Prerequisites

- Node.js 24 (or a current LTS) and npm
- The Employee Directory API running and reachable (defaults to `http://localhost:5102`)
- An OIDC identity provider with a client registered for this app (only when auth is enabled)

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

The dev server runs on **http://localhost:5174** (`strictPort` is on, so it won't fall back to another port; the auth redirect URI depends on it).

## Configuration

All configuration is through `VITE_*` environment variables in `.env`.

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_URL` | Yes | Base URL of the API, e.g. `https://api.example.com`. A trailing slash is stripped. Falls back to `http://localhost:5102` with a console warning. |
| `VITE_AUTH_ENABLED` | Yes | `true` to require sign-in. When `false`, everyone is treated as signed in **with edit rights**. Use this for local development only. |
| `VITE_AUTH_AUTHORITY` | When auth is on | OIDC issuer URL. |
| `VITE_AUTH_CLIENT_ID` | When auth is on | Client ID registered with the identity provider. |
| `VITE_AUTH_SCOPE` | When auth is on | Space-separated scopes to request, e.g. `"openid profile employee-directory.read employee-directory.write"`. |
| `VITE_AUTH_WRITE_SCOPE` | When auth is on | The scope that grants edit rights. If it's missing from the access token (or this variable is unset), the user is read-only. |

> **Vite bakes these values into the bundle at build time.** Changing them means rebuilding, and nothing in them is secret: anyone can read them from the served JavaScript.

## Authentication

- Uses the authorization code flow with PKCE (`response_type: "code"`).
- Tokens are kept in `sessionStorage`, so closing the tab signs the user out.
- Any page under the protected routes triggers a sign-in redirect if there's no valid user; the original path is restored after `/callback`.
- A `401` from the API sends the user back through sign-in.
- Edit rights come from the `scope` claim in the access token, checked against `VITE_AUTH_WRITE_SCOPE`. The UI check is a convenience only; the API must enforce the same scope.

Register these with the identity provider for each environment:

- **Redirect URI:** `<app origin>/callback`
- **Post-logout redirect URI:** `<app origin>/`
- **Allowed CORS origin:** `<app origin>`

The API must also allow the app's origin in its CORS policy.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Deployment

1. Set the production `VITE_*` values (in `.env.production` or as environment variables in CI).
2. Run `npm ci && npm run build`.
3. Serve the `dist/` folder from any static host.

The app uses client-side routing, so the host **must fall back to `index.html` for unknown paths**. Without this, refreshing `/employees/123` or returning to `/callback` from the identity provider returns a 404.

Recommended caching: long-lived cache headers for `dist/assets/*` (the filenames are content-hashed), and `no-cache` for `index.html`.

## Project structure

```
src/
  api/            Axios client (auth header, 401 handling) and endpoint functions
  auth/           OIDC UserManager, ProtectedRoute, scope checks, editor guard
  components/     Shared UI; orgChart/, position/, createEmployee/ and ui/ hold feature and primitive components
  hooks/          Data fetching (useAsyncData), forms, wizard and org chart state
  lib/            Pure helpers: error messages, org chart graph/layout, seating map
  pages/          Route components
  types/          API response types
  router.tsx      Route definitions; editor and org chart pages are lazy-loaded
```

### Floor plans and seating

Floor plans are SVGs in `src/assets/`. Seat areas are mapped by seating position ID in `SEATING_MAP` in `src/lib/seating.ts`, as rectangles in each floor's SVG coordinate space. Update that map when desks move or a new area is added.

### Error messages

User-facing messages live in `src/lib/messages.ts`. `getProblemDetailsMessage` (`src/lib/apiError.ts`) shows the API's ProblemDetails `title`/`detail` when present. It maps 403 responses to a permission message and unreachable-API errors to a connection message, and otherwise uses the fallback for that action.
