export const metadata = { title: "Privacy | Flex" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-4 px-4 py-16 text-sm leading-relaxed">
      <h1 className="text-2xl font-semibold">Privacy</h1>
      <p>Flex is free to use and doesn&apos;t require an account to search or compare prices.</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>We don&apos;t require sign-up or login for basic product search.</li>
        <li>We store the text of your search query and the product it matched, with a timestamp — not your IP address or any other identifier.</li>
        <li>We don&apos;t use tracking cookies or sell any data to third parties.</li>
        <li>Clicking &ldquo;View Deal&rdquo; takes you to the merchant&apos;s own website, which has its own separate privacy policy.</li>
      </ul>
      <p>
        If Flex later adds optional accounts or price alerts, this page will be updated before
        that happens.
      </p>
    </main>
  );
}
