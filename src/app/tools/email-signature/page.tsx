import { EmailSignatureStudio } from "@/components/tools/EmailSignatureStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Clickable HTML Email Signature Studio (Gmail/Outlook) — THE SABBiR OS",
  description:
    "Design executive, responsive HTML email signatures for Gmail, Apple Mail, Outlook, and Thunderbird with social icons, avatar photos, and 1-click clipboard paste.",
  path: "/tools/email-signature",
});

export default function EmailSignaturePage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <EmailSignatureStudio />
    </div>
  );
}
