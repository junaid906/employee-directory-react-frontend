interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="px-4 py-12 text-center sm:px-6">
      <p className="text-neutral-500">{message}</p>
    </div>
  );
}
