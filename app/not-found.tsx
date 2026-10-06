import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground">That page doesn&apos;t exist.</p>
      <Link href="/" className="text-sm font-medium underline-offset-4 hover:underline">
        Back to home
      </Link>
    </main>
  );
}
