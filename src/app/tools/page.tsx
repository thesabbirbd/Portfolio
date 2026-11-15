import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { ToolsSuite } from "@/components/discover/Tools";
import { pageMetadata } from "@/lib/seo";
import { TelemetryStrip } from "@/components/telemetry/TelemetryStrip";
import { BanglaGuideModal } from "@/components/ui/BanglaGuideModal";
import { WorkplaceQuickDock } from "@/components/workplace/WorkplaceQuickDock";

export const metadata = pageMetadata({
  title: "Interactive Tools — SQL Sandbox, Docker, Cron, Subnet & SaaS Calculators | THE SABBiR",
  description: "Free browser tools by THE SABBiR: in-browser SQL schema sandbox, Docker & Nginx generator, cron & systemd timer explainer, BD e-commerce margin calculator, subnet/CIDR, chmod, and prompt architect. Nothing leaves your browser.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <PageHeader
        crumbs={[{ label: "Explore", href: "/explore" }, { label: "Tools" }]}
        eyebrow="Interactive tools"
        title={<>Small tools, <Accent>daily use</Accent></>}
        lede="Everyday database, sysadmin, DevOps and business SaaS helpers. They run entirely in your browser — nothing you type is sent anywhere."
        expression="signal"
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="w-full sm:flex-1">
          <TelemetryStrip />
        </div>
        <div className="shrink-0">
          <BanglaGuideModal topic="tools" />
        </div>
      </div>
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-16">
        <WorkplaceQuickDock />
        <ToolsSuite />
      </div>
    </div>
  );
}
