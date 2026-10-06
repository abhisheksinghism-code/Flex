import { Skeleton } from "@/components/ui/skeleton";

export default function SearchPageLoading() {
  return (
    <main className="mx-auto max-w-2xl space-y-4 px-4 py-16">
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </main>
  );
}
