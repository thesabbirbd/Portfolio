import { QuickReplyHubStudio } from "@/components/tools/QuickReplyHubStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "WhatsApp & F-Commerce Smart Quick Reply Macro Hub — THE SABBiR OS",
  description:
    "Instant Bangla, Banglish, and English customer support macros for Facebook Page and Daraz online shops with live customer name, delivery fee, and bKash variable replacement.",
  path: "/tools/quick-reply-hub",
});

export default function QuickReplyHubPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <QuickReplyHubStudio />
    </div>
  );
}
