import { SuperAdminConsole } from "@/components/superadmin/SuperAdminConsole";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "SuperAdmin Control Plane — THE SABBiR OS",
  description: "Enterprise SaaS control plane, database telemetry, and WAF security operations.",
  path: "/superadmin",
  noindex: true,
});

export default function SuperAdminPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10">
      <SuperAdminConsole />
    </div>
  );
}
