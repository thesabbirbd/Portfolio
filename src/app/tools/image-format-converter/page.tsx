import { ImageFormatConverterStudio } from "@/components/tools/ImageFormatConverterStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "OmniFormat Image Converter & Aspect Ratio Sizer — THE SABBiR OS",
  description:
    "Client-side batch image converter between PNG, JPG, WebP, AVIF, and ICO with EXIF privacy stripping and responsive aspect ratio cropping.",
  path: "/tools/image-format-converter",
  keywords: [
    "image format converter",
    "png to webp",
    "jpg to webp",
    "avif converter",
    "exif stripper",
    "the sabbir os",
  ],
});

export default function ImageFormatConverterPage() {
  return <ImageFormatConverterStudio />;
}
