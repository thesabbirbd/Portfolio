import { EmbedWidgetRenderer } from "@/components/embed/EmbedWidgetRenderer";
import { EMBED_WIDGETS } from "@/lib/embed/widget-registry";
import { pageMetadata } from "@/lib/seo";
import { Metadata } from "next";

interface Props {
  params: Promise<{ tool: string }>;
  searchParams: Promise<{ theme?: string; lang?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool } = await params;
  const widget = EMBED_WIDGETS[tool];
  if (!widget) {
    return pageMetadata({
      title: "Embed Widget | THE SABBiR OS",
      description: "Embeddable utility widget for external websites.",
      path: `/embed/${tool}`,
      noindex: true,
    });
  }

  return pageMetadata({
    title: `${widget.name} (Embed Widget) | THE SABBiR`,
    description: widget.description,
    path: `/embed/${tool}`,
  });
}

export function generateStaticParams() {
  return Object.keys(EMBED_WIDGETS).map((slug) => ({ tool: slug }));
}

export default async function EmbedPage({ params, searchParams }: Props) {
  const { tool } = await params;
  const { theme, lang } = await searchParams;

  return (
    <div className="w-full h-screen overflow-hidden bg-background">
      <EmbedWidgetRenderer toolSlug={tool} theme={theme} lang={lang} />
    </div>
  );
}
