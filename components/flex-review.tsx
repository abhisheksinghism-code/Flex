import { Check, Minus } from "lucide-react";
import type { ReviewSummary } from "@/lib/core/types";

export function FlexReview({ summary }: { summary: ReviewSummary }) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight">Flex Review</h2>
        <p className="text-xs text-muted-foreground">AI summary of customer feedback</p>
      </div>

      {summary.insufficientData ? (
        <p className="text-sm text-muted-foreground">
          Not enough customer feedback yet to generate a Flex Review for this product.
        </p>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            {summary.likes.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium">Buyers love</h3>
                <ul className="space-y-1.5">
                  {summary.likes.map((like) => (
                    <li key={like} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
                      {like}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {summary.complaints.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium">Buyers mention</h3>
                <ul className="space-y-1.5">
                  {summary.complaints.map((complaint) => (
                    <li
                      key={complaint}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <Minus className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                      {complaint}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {summary.verdict && (
            <div className="border-t border-border pt-5">
              <h3 className="mb-1.5 text-sm font-medium">Flex take</h3>
              <p className="text-sm leading-relaxed text-foreground">{summary.verdict}</p>
            </div>
          )}

          {(summary.bestFor || summary.thinkTwiceIf) && (
            <div className="flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:gap-6">
              {summary.bestFor && (
                <p>
                  <span className="font-medium text-foreground">Best for </span>
                  {summary.bestFor}
                </p>
              )}
              {summary.thinkTwiceIf && (
                <p>
                  <span className="font-medium text-foreground">Think twice if </span>
                  {summary.thinkTwiceIf}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
