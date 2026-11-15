import { EphemeralShareViewer } from "@/components/workplace/EphemeralShareViewer";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "24-Hour Ephemeral Share — THE SABBiR OS",
  description: "Temporary 24-hour studio snapshot on THE SABBiR OS Workplace.",
  path: "/s",
  noindex: true,
});

export default async function EphemeralSharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  return (
    <div className="min-h-screen px-4 py-8">
      <EphemeralShareViewer token={token} />
    </div>
  );
}
