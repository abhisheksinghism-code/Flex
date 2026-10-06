import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MAX_QUERY_LENGTH } from "@/lib/validation/search";

export function SearchBar({ defaultValue }: { defaultValue?: string }) {
  return (
    <form action="/search" method="GET" className="flex w-full max-w-xl gap-2">
      <Input
        name="q"
        defaultValue={defaultValue}
        placeholder="What do you want to buy?"
        maxLength={MAX_QUERY_LENGTH}
        minLength={2}
        required
        aria-label="Product search"
        className="h-12 text-base"
      />
      <Button type="submit" size="lg" className="h-12 shrink-0">
        Compare Prices
      </Button>
    </form>
  );
}
