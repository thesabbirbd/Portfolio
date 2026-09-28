import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeWelcomePopup } from "@/components/ui/ThemeWelcomePopup";
import { IdentityDock } from "@/components/ui/IdentityDock";
import { CommandMenu } from "@/components/ui/CommandMenu";
import { MorphingNav } from "@/components/navigation/MorphingNav";
import { Footer } from "@/components/layout/Footer";
import { TerminalModal } from "@/components/ui/TerminalModal";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { LiquidBackground } from "@/components/ui/LiquidBackground";
import { FloatingGlassBackground } from "@/components/ui/FloatingGlassBackground";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { SmoothCursor } from "@/components/lightswind/smooth-cursor";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// METADATA (Restored dynamically from previous)
// METADATA
export const metadata: Metadata = {
  metadataBase: new URL("https://sabbir.nav.bd"),
  title: "Md Sabbirul Islam Khan — THE SABBiR | Backend, DevOps, AI & Systems",
  description: "Md Sabbirul Islam Khan, known online as THE SABBiR, is a Management student from Rajshahi, Bangladesh exploring Backend Engineering, DevOps, AI, Linux, Networking, IT Systems and Creative Technology.",
  keywords: ["Md Sabbirul Islam Khan", "THE SABBiR", "sabbir.nav.bd", "Backend Engineering", "DevOps", "Local AI", "IT Systems"],
  authors: [{ name: "Md Sabbirul Islam Khan", url: "https://github.com/thesabbirbd" }],
  creator: "Md Sabbirul Islam Khan",
  publisher: "THE SABBiR",
  alternates: {
    canonical: "https://sabbir.nav.bd",
  },
  openGraph: {
    title: "Md Sabbirul Islam Khan — THE SABBiR | Backend, DevOps, AI & Systems",
    description: "Md Sabbirul Islam Khan, known online as THE SABBiR, is a Management student from Rajshahi, Bangladesh exploring Backend Engineering, DevOps, AI, Linux, Networking, IT Systems and Creative Technology.",
    url: "https://sabbir.nav.bd",
    siteName: "THE SABBiR",
    images: [
      {
        url: "/the-sabbir-og-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "Md Sabbirul Islam Khan — THE SABBiR professional portrait",
      },
    ],
    locale: "en_US",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Md Sabbirul Islam Khan — THE SABBiR | Backend, DevOps, AI & Systems",
    description: "Md Sabbirul Islam Khan, known online as THE SABBiR, is a Management student from Rajshahi, Bangladesh exploring Backend Engineering, DevOps, AI, Linux, Networking, IT Systems and Creative Technology.",
    creator: "@thesabbirbd",
    images: ["/the-sabbir-og-1200x630.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};


const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://sabbir.nav.bd/#person",
      "name": "Md Sabbirul Islam Khan",
      "alternateName": "THE SABBiR",
      "url": "https://sabbir.nav.bd",
      "image": "https://sabbir.nav.bd/the-sabbir-og-1200x630.jpg",
      "description": "Md Sabbirul Islam Khan, known online as THE SABBiR, is a Management student from Rajshahi, Bangladesh exploring Backend Engineering, DevOps, AI, Linux, Networking, IT Systems and Creative Technology.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Rajshahi",
        "addressCountry": "Bangladesh"
      },
      "alumniOf": [
        {
          "@type": "CollegeOrUniversity",
          "name": "Rajshahi College"
        }
      ],
      "knowsAbout": [
        "Backend Engineering",
        "DevOps",
        "FastAPI",
        "Docker",
        "PostgreSQL",
        "Linux",
        "Local AI",
        "Ollama",
        "Networking"
      ],
      "sameAs": [
        "https://github.com/thesabbirbd",
        "https://linkedin.com/in/thesabbirbd",
        "https://facebook.com/iamthesabbir",
        "https://x.com/thesabbirbd",
        "https://instagram.com/iam_thesabbir",
        "https://www.google.com/maps/contrib/115922089427483699024"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://sabbir.nav.bd/#website",
      "url": "https://sabbir.nav.bd",
      "name": "THE SABBiR",
      "alternateName": "Md Sabbirul Islam Khan",
      "description": "Md Sabbirul Islam Khan, known online as THE SABBiR, is a Management student from Rajshahi, Bangladesh exploring Backend Engineering, DevOps, AI, Linux, Networking, IT Systems and Creative Technology.",
      "publisher": {
        "@id": "https://sabbir.nav.bd/#person"
      }
    }
  ]
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} scroll-smooth antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background text-foreground transition-colors duration-500 min-h-screen flex flex-col selection:bg-[var(--color-secondary)]/10 selection:text-[var(--color-secondary)]">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ThemeWelcomePopup />
          {/* <LoadingScreen /> */}
          <LiquidBackground />
          <FloatingGlassBackground />
          <div className="grain-overlay" />
          <MorphingNav />
          <SmoothScroll>
            <main className="flex-1 w-full max-w-full relative z-10 pt-16 md:pt-24 overflow-x-clip">{children}</main>
            <Footer />
            <TerminalModal />
          </SmoothScroll>
          <CommandMenu />
          <IdentityDock />
          <div className="hidden md:block">
            <SmoothCursor color="#ffffff" glowEffect={false} rotateOnMove={false} scaleOnClick={true} magneticElements="button, a" magneticDistance={40} />
          </div>
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}