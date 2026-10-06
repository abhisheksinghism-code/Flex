export const metadata = { title: "Disclaimer | Flex" };

export default function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-4 px-6 py-16 text-sm leading-relaxed">
      <h1 className="text-2xl font-semibold tracking-tight">Disclaimer</h1>
      <p>
        Flex is currently running in demo mode. Product prices, ratings, review counts, and
        availability shown on this site are seeded sample data for demonstration purposes and do
        not reflect real, live prices on Amazon, Flipkart, or Myntra.
      </p>
      <p>
        When real merchant data is connected in a later phase, prices and availability can still
        change at any time on the merchant&apos;s own site after Flex last checked them.
      </p>
      <p>
        Flex does not sell any products. All purchases are completed on the merchant&apos;s own
        website after you click &ldquo;View Deal.&rdquo;
      </p>
      <p>
        Ratings and reviews referenced by the Flex AI Review belong to their respective sources
        and platforms.
      </p>
      <p>
        The Flex AI Review is generated from the review information Flex has access to. It does
        not fabricate opinions beyond that information, and will say so when there isn&apos;t
        enough data to summarize.
      </p>
    </main>
  );
}
