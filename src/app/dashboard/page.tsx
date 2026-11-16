import { UserSaaSDashboard } from "@/components/dashboard/UserSaaSDashboard";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "SaaS User Workspace & Dashboard — THE SABBiR OS",
  description:
    "Your immortal personal SaaS dashboard for THE SABBiR OS: track input-to-action agent jobs, visual share cards, pinned tools, career passport, and blank-password login settings.",
  path: "/dashboard",
  keywords: [
    "sabbir os dashboard",
    "user saas panel",
    "agent jobs tracker",
    "career passport",
    "blank password login",
    "the sabbir os",
  ],
});

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 pt-20 pb-16">
      <UserSaaSDashboard />
    </main>
  );
}
