import { ColorDesignLabStudio } from "@/components/tools/ColorDesignLabStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Color Design Lab, Tailwind v4 Palette & WCAG Matrix — THE SABBiR OS",
  description:
    "Generate 50–950 Tailwind CSS v4 shade stops from any hex color, calculate live WCAG 2.1 AA/AAA contrast ratios, and export design tokens.",
  path: "/tools/color-design-lab",
});

export default function ColorDesignLabPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <ColorDesignLabStudio />
    </div>
  );
}
