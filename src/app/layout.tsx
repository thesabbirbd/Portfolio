import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ToastProvider } from "@/contexts/ToastContext";
import { ThemeToast } from "@/components/ui/ThemeToast";
import { THEME_INIT_SCRIPT } from "@/lib/theme-color";
import { DeferredThirdParty } from "@/components/system/DeferredThirdParty";
import { AIYAAR } from "@/data/aiyaar";
import { SOCIAL_LINKS } from "@/data/socials";
import { IdentityDock } from "@/components/ui/IdentityDock";
import { CommandMenu } from "@/components/ui/CommandMenu";
import { MorphingNav } from "@/components/navigation/MorphingNav";
import { Footer } from "@/components/layout/Footer";
import { TerminalModal } from "@/components/ui/TerminalModal";
import { SettingsPanel } from "@/components/ui/SettingsPanel";
import { MotionPreferences } from "@/components/theme/MotionPreferences";
import { LiquidBackground } from "@/components/ui/LiquidBackground";
import { FloatingGlassBackground } from "@/components/ui/FloatingGlassBackground";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { SoundScape } from "@/components/system/SoundScape";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// METADATA (Restored dynamically from previous)
// METADATA
export const metadata: Metadata = {
  metadataBase: new URL("https://sabbir.nav.bd"),
  title: "Md Sabbirul Islam Khan — THE SABBiR | Backend, DevOps, AI & Systems",
  description: "Md Sabbirul Islam Khan, known online as THE SABBiR, is a Management student from Rajshahi, Bangladesh exploring Backend Engineering, DevOps, AI, Linux, Networking, IT Systems and Creative Technology.",
  keywords: ["Md Sabbirul Islam Khan", "THE SABBiR", "sabbir.nav.bd", "Backend Engineering", "DevOps", "Local AI", "IT Systems", "Aiyaar", "Chief Product Manager", "POS software Bangladesh", "digital khata"],
  authors: [{ name: "Md Sabbirul Islam Khan", url: "https://github.com/thesabbirbd" }],
  creator: "Md Sabbirul Islam Khan",
  publisher: "THE SABBiR",
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
  verification: {
    other: {
      "msvalidate.01": "2A1C034D7F08C07516BA1E476BC97EE0",
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
      "image": [
        "https://sabbir.nav.bd/branding/the-sabbir-avatar-1x1.png",
        "https://sabbir.nav.bd/branding/the-sabbir-avatar-4x3.png",
        "https://sabbir.nav.bd/branding/the-sabbir-avatar-16x9.png"
      ],
      "description": "Md Sabbirul Islam Khan, known online as THE SABBiR, is a Management student from Rajshahi, Bangladesh exploring Backend Engineering, DevOps, AI, Linux, Networking, IT Systems and Creative Technology.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Rajshahi",
        "addressCountry": "Bangladesh"
      },
      "jobTitle": AIYAAR.roleTitle,
      "worksFor": {
        "@type": "Organization",
        "name": AIYAAR.name,
        "url": AIYAAR.url
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
      // Same canonical profile URLs the site links to (src/data/socials.ts), minus tracking params.
      "sameAs": SOCIAL_LINKS.filter((l) => l.url.startsWith("https://")).map((l) => l.url.replace(/\?utm_[^#]*$/, ""))
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
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        <Script id="service-worker" strategy="afterInteractive">
          {/* Production only: dev chunks are not content-hashed, so a caching SW would serve stale JS
              (hydration mismatches). In dev, remove any worker and caches left from a production run.
              afterInteractive usually runs after window "load" has fired, so register right away then. */}
          {process.env.NODE_ENV === "production"
            ? `if ("serviceWorker" in navigator) { var r = function() { navigator.serviceWorker.register("/sw.js").catch(function() {}); }; if (document.readyState === "complete") r(); else window.addEventListener("load", r); }`
            : `if ("serviceWorker" in navigator) { navigator.serviceWorker.getRegistrations().then(function(rs) { rs.forEach(function(r) { r.unregister(); }); }); if (window.caches) caches.keys().then(function(ks) { ks.forEach(function(k) { caches.delete(k); }); }); }`}
        </Script>
        {/* Colour theme (saved choice → this session's pick → new random pick) and the motion
            preference are applied before first paint: no flash, no hydration mismatch. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd).replaceAll('<', String.raw`\u003c`)}
        </script>
      </head>
      <body className="bg-background text-foreground transition-colors duration-500 min-h-screen flex flex-col selection:bg-[var(--color-secondary)]/10 selection:text-[var(--color-secondary)]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-full focus:bg-primary focus:text-on-primary focus:font-semibold focus:shadow-e3"
        >
          Skip to content
        </a>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <MotionPreferences>
          <ToastProvider>
          <ThemeToast />
          <LiquidBackground />
          <FloatingGlassBackground />
          <div className="grain-overlay" />
          <div aria-hidden="true" className="scroll-thread print:hidden" />
          <MorphingNav />
          <main id="main-content" tabIndex={-1} className="flex-1 w-full focus:outline-none max-w-full relative z-10 pt-[max(0.75rem,env(safe-area-inset-top))] md:pt-24 short-landscape:pt-16 overflow-x-clip">{children}</main>
          <Footer />
          <TerminalModal />
          <CommandMenu />
          <IdentityDock />
          <SettingsPanel />
          <div className="hidden md:block">
            <CustomCursor />
          </div>
          <SpeedInsights />
          <Analytics />
          {/* Google Analytics + Microsoft Clarity, loaded once the page has settled. */}
          <DeferredThirdParty />
          <SoundScape />
        </ToastProvider>
          </MotionPreferences>
        </ThemeProvider>
      </body>
    </html>
  );
}