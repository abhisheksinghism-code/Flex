import Link from "next/link";
import { SearchBar } from "@/components/search-bar";

const EXAMPLES = [
  "iPhone 17 Pro 256GB",
  "Nike Air Max 90",
  "Samsung Galaxy S26 Ultra",
  "Levi's 511 jeans",
  "Sony WH-1000XM6",
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center justify-center gap-8 px-4 text-center">
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Search once. Compare everywhere.</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Find it. Compare it. Flex the best deal.
        </h1>
      </div>
      <SearchBar />
      <div className="flex flex-wrap justify-center gap-2 text-sm">
        {EXAMPLES.map((example) => (
          <Link
            key={example}
            href={`/search?q=${encodeURIComponent(example)}`}
            className="rounded-full border px-3 py-1 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            {example}
          </Link>
        ))}
      </div>
    </main>
  );
}
