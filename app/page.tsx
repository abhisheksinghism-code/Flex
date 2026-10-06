import Link from "next/link";
import { SearchBar } from "@/components/search-bar";

const EXAMPLES = [
  "iPhone 17 Pro",
  "Nike Air Max 90",
  "Galaxy S26 Ultra",
  "Levi's 511",
  "Sony WH-1000XM6",
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-8.5rem)] max-w-2xl flex-col items-center justify-center gap-10 px-6 text-center">
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Shop smarter.
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          Compare prices. Know what buyers think. Make the right call.
        </p>
      </div>

      <SearchBar />

      <p className="text-sm text-muted-foreground">
        Try:{" "}
        {EXAMPLES.map((example, index) => (
          <span key={example}>
            <Link
              href={`/search?q=${encodeURIComponent(example)}`}
              className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {example}
            </Link>
            {index < EXAMPLES.length - 1 && <span className="px-1.5 text-border">·</span>}
          </span>
        ))}
      </p>
    </main>
  );
}
