import { Skeleton } from "@/components/ui/skeleton";

export default function ComparePageLoading() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <Skeleton className="h-9 w-2/3" />
      <div className="space-y-2 rounded-lg border p-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-3 rounded-lg border p-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </main>
  );
}
