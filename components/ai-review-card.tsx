import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReviewSummary } from "@/lib/core/types";

export function AIReviewCard({ summary }: { summary: ReviewSummary }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Flex AI Review</CardTitle>
      </CardHeader>
      <CardContent>
        {summary.insufficientData ? (
          <p className="text-sm text-muted-foreground">
            Not enough reliable review data available to generate a summary.
          </p>
        ) : (
          <div className="space-y-4">
            {summary.likes.length > 0 && (
              <div>
                <h3 className="mb-1 text-sm font-medium">What buyers like</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {summary.likes.map((like) => (
                    <li key={like}>{like}</li>
                  ))}
                </ul>
              </div>
            )}
            {summary.complaints.length > 0 && (
              <div>
                <h3 className="mb-1 text-sm font-medium">Common complaints</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {summary.complaints.map((complaint) => (
                    <li key={complaint}>{complaint}</li>
                  ))}
                </ul>
              </div>
            )}
            {summary.verdict && (
              <div>
                <h3 className="mb-1 text-sm font-medium">Flex Verdict</h3>
                <p className="text-sm italic">&ldquo;{summary.verdict}&rdquo;</p>
              </div>
            )}
            {(summary.bestFor || summary.thinkTwiceIf) && (
              <div className="space-y-1 text-sm">
                {summary.bestFor && (
                  <p>
                    <span className="font-medium">Best for:</span> {summary.bestFor}
                  </p>
                )}
                {summary.thinkTwiceIf && (
                  <p>
                    <span className="font-medium">Think twice if:</span> {summary.thinkTwiceIf}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
