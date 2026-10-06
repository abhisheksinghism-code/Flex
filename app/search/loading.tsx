import { Skeleton } from "@/components/ui/skeleton";

export default function SearchPageLoading() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="mb-8 text-center text-sm text-muted-foreground">Finding the best matches…</p>
      <div className="space-y-3">
        <Skeleton className="h-[72px] w-full rounded-2xl" />
        <Skeleton className="h-[72px] w-full rounded-2xl" />
      </div>
    </main>
  );
}
