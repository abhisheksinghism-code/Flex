import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
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
    >
      <body className="flex min-h-full flex-col">
        <header className="h-16">
          <div className="mx-auto flex h-full max-w-5xl items-center px-6">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Flex
            </Link>
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer>
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-8 text-xs text-muted-foreground">
            <p>Flex does not sell products. Purchases complete on the merchant&apos;s own site.</p>
            <nav className="flex gap-4">
              <Link href="/disclaimer" className="transition-colors hover:text-foreground">
                Disclaimer
              </Link>
              <Link href="/privacy" className="transition-colors hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="transition-colors hover:text-foreground">
                Terms
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
