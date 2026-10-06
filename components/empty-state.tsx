import type { ReactNode } from "react";

export function EmptyState({
  title,
  message,
  children,
}: {
  title: string;
  message: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-24 text-center">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-muted-foreground">{message}</p>
      </div>
      {children}
    </div>
  );
}
