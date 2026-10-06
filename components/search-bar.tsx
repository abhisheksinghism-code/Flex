import { Search } from "lucide-react";
import { MAX_QUERY_LENGTH } from "@/lib/validation/search";

export function SearchBar({ defaultValue }: { defaultValue?: string }) {
  return (
    <form
      action="/search"
      method="GET"
      className="group flex w-full max-w-xl items-center gap-2 rounded-2xl border border-border bg-card p-2 pl-5 shadow-sm transition-shadow focus-within:border-primary/40 focus-within:shadow-md"
    >
      <Search
        className="size-5 shrink-0 text-muted-foreground transition-colors group-focus-within:text-primary"
        aria-hidden="true"
      />
      <input
        name="q"
        defaultValue={defaultValue}
        placeholder="What do you want to buy?"
        maxLength={MAX_QUERY_LENGTH}
        minLength={2}
        required
        aria-label="Product search"
        autoComplete="off"
        className="h-10 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground/70"
      />
      <button
        type="submit"
        className="h-10 shrink-0 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Compare
      </button>
    </form>
  );
}
