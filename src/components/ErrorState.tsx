interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded border border-neutral-300 bg-white p-4">
      <p className="text-black">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded bg-black px-4 py-2 text-white"
        >
          Retry
        </button>
      )}
    </div>
  );
}
