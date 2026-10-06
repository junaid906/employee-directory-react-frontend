import { Link, useRouteError } from "react-router";
import { RegularHeader } from "./Header";

export default function RouteErrorPage() {
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-white text-black">
      <RegularHeader />
      <main className="mx-auto">
        <div className="rounded border border-neutral-300 bg-white p-6">
          <p className="text-sm font-medium text-neutral-500">Error</p>
          <h1 className="mt-1 text-xl font-semibold text-black">
            Something went wrong
          </h1>
          <p className="mt-2 text-neutral-600">
            An unexpected error occurred while rendering this page.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block bg-black px-4 py-2 text-white"
          >
            Back to homepage
          </Link>
          {error instanceof Error ? (
            <p className="mt-4 rounded border border-neutral-300 bg-neutral-100 p-3 font-mono text-sm text-neutral-700">
              {error.message}
            </p>
          ) : null}
        </div>
      </main>
    </div>
  );
}
