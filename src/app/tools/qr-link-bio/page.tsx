import { QrLinkBioStudio } from "@/components/tools/QrLinkBioStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Digital Visiting Card & vCard Standee Studio — THE SABBiR OS",
  description:
    "Linktree & HiHello alternative. Generate RFC 6350 .vcf vCards, printable bKash/Nagad payment desk standees, and guest Wi-Fi QR cards directly in browser.",
  path: "/tools/qr-link-bio",
});

export default function QrLinkBioPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <QrLinkBioStudio />
    </div>
  );
}
