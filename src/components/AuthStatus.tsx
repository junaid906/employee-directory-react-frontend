import type { ReactNode } from "react";
import Spinner from "./ui/Spinner";

interface AuthStatusProps {
  message: string;
  action?: ReactNode;
  pending?: boolean;
}

export default function AuthStatus({ message, action, pending = false }: AuthStatusProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded border border-neutral-300 bg-white p-6 text-center">
        <img src="/favicon.ico" alt="" className="h-auto w-8 object-contain" />
        {pending && <Spinner label={message} />}
        <p className="text-sm text-neutral-600">{message}</p>
        {action}
      </div>
    </div>
  );
}
