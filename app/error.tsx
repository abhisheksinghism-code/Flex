"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Logged server-side only — no internals are rendered to the user.
    console.error("[flex] unhandled page error:", error.digest ?? error.message);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground">
        That wasn&apos;t supposed to happen. Please try again.
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </main>
  );
}
