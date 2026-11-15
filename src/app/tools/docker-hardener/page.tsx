import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import { DockerHardenerStudio } from "@/components/tools/DockerHardenerStudio";

export const metadata = pageMetadata({
  title: "Dockerfile AST Security Scanner & Hardening Engine | THE SABBiR",
  description: "Audit Dockerfiles for root execution, floating latest tags, and secrets. Get a 0-100 security score and generate an auto-hardened multi-stage container file.",
  path: "/tools/docker-hardener",
});

export default function DockerHardenerPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8 pb-16">
      <PageHeader
        crumbs={[{ label: "Tools", href: "/tools" }, { label: "Docker Hardener" }]}
        eyebrow="DevOps & Security"
        title={<>Dockerfile AST <Accent>Security Hardener</Accent></>}
        lede="Audit container definitions against modern CIS benchmarks, unprivileged non-root user execution, and pinned multi-stage build patterns."
        expression="signal"
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <DockerHardenerStudio />
      </div>
    </div>
  );
}
