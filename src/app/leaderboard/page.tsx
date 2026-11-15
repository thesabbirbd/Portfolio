import { LeaderboardHub } from "@/components/workplace/LeaderboardHub";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Global Leaderboard & XP Standings — THE SABBiR OS",
  description:
    "Real-time creator and builder rankings across 35 everyday studios, DevOps arcade games, and multi-agent swarms.",
  path: "/leaderboard",
});

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
      <LeaderboardHub />
    </div>
  );
}
