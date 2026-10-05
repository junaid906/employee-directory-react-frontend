import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="rounded border border-neutral-300 bg-white p-6">
      <p className="text-sm font-medium text-neutral-500">404</p>
      <h1 className="mt-1 text-xl font-semibold text-black">Page not found</h1>
      <p className="mt-2 text-neutral-600">
        The page you are looking for doesn't exist or may have been moved.
      </p>
      <Link
        to="/"
        className="mt-4 inline-block bg-black px-4 py-2 text-white"
      >
        Back to homepage
      </Link>
    </div>
  );
}
