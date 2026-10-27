import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flex — Search once. Compare everywhere.",
  description:
    "Compare prices and ratings for any product across Amazon, Flipkart, and Myntra, with an AI-generated buying summary.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <header className="h-16">
            <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4 sm:px-6">
              <Link
                href="/"
                className="-mx-2 flex h-11 items-center rounded-xl px-2 text-lg font-semibold tracking-tight transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Flex
              </Link>
              <ThemeToggle />
            </div>
          </header>
          <div className="flex-1">{children}</div>
          <footer>
            <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <p>Flex does not sell products. Purchases complete on the merchant&apos;s own site.</p>
              <nav className="-mx-2 flex flex-wrap">
                <Link
                  href="/disclaimer"
                  className="flex h-11 items-center rounded-lg px-2 transition-colors hover:text-foreground"
                >
                  Disclaimer
                </Link>
                <Link
                  href="/privacy"
                  className="flex h-11 items-center rounded-lg px-2 transition-colors hover:text-foreground"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  className="flex h-11 items-center rounded-lg px-2 transition-colors hover:text-foreground"
                >
                  Terms
                </Link>
              </nav>
            </div>
          </footer>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
