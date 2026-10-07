interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="px-6 py-12 text-center">
      <p className="text-neutral-500">{message}</p>
    </div>
  );
}
