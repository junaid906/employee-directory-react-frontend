import type { ReactNode } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  confirmingLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  confirmingLabel,
  cancelLabel = "Cancel",
  isConfirming = false,
  error,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm rounded border border-neutral-300 bg-white p-6 shadow-xl"
      >
        <h2 className="text-lg font-semibold text-black">{title}</h2>
        <div className="mt-2 text-sm text-neutral-600">{message}</div>
        {error && (
          <p className="mt-3 rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isConfirming}
            className="rounded border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isConfirming ? (confirmingLabel ?? confirmLabel) : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
