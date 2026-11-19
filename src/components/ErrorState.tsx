import Button from "./ui/Button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded border border-neutral-300 bg-white p-4">
      <p className="text-black">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} className="mt-3">
          Retry
        </Button>
      )}
    </div>
  );
}
