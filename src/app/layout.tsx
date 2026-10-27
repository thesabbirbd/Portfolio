import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ToastProvider } from "@/contexts/ToastContext";
import { ThemeWelcomePopup } from "@/components/ui/ThemeWelcomePopup";
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

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// METADATA (Restored dynamically from previous)
// METADATA
export const metadata: Metadata = {
  metadataBase: new URL("https://sabbir.nav.bd"),
  title: "Md Sabbirul Islam Khan — THE SABBiR | Backend, DevOps, AI & Systems",
  description: "Md Sabbirul Islam Khan, known online as THE SABBiR, is a Management student from Rajshahi, Bangladesh exploring Backend Engineering, DevOps, AI, Linux, Networking, IT Systems and Creative Technology.",
  keywords: ["Md Sabbirul Islam Khan", "THE SABBiR", "sabbir.nav.bd", "Backend Engineering", "DevOps", "Local AI", "IT Systems", "Aiyaar", "Aiyaar Ltd", "Chief Project Manager", "POS software Bangladesh", "digital khata"],
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
      "jobTitle": "Chief Project Manager",
      "worksFor": {
        "@type": "Organization",
        "name": "Aiyaar Ltd",
        "url": "https://aiyaar.ltd"
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
        "https://www.linkedin.com/in/thesabbirbd/",
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
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        {/* Google Analytics Tag */}
        {/* Analytics load after the page is idle (lazyOnload) so they never compete with hydration. */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-47T386XBN6"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-47T386XBN6');
          `}
        </Script>

        <Script id="service-worker" strategy="afterInteractive">
          {/* Production only: dev chunks are not content-hashed, so a caching SW would serve stale JS
              (hydration mismatches). In dev, remove any worker and caches left from a production run.
              afterInteractive usually runs after window "load" has fired, so register right away then. */}
          {process.env.NODE_ENV === "production"
            ? `if ("serviceWorker" in navigator) { var r = function() { navigator.serviceWorker.register("/sw.js").catch(function() {}); }; if (document.readyState === "complete") r(); else window.addEventListener("load", r); }`
            : `if ("serviceWorker" in navigator) { navigator.serviceWorker.getRegistrations().then(function(rs) { rs.forEach(function(r) { r.unregister(); }); }); if (window.caches) caches.keys().then(function(ks) { ks.forEach(function(k) { caches.delete(k); }); }); }`}
        </Script>
        <Script id="microsoft-clarity" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "ypf1mf272k");
          `}
        </Script>
        {/* Apply the saved colour palette and motion preference before first paint (no flash, no reveal for reduced motion). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var d=document.documentElement,c=localStorage.getItem("sabbir_color_theme");if(c==="orange"||c==="blue"||c==="green")d.setAttribute("data-theme-color",c);if(localStorage.getItem("sabbir_reduced_motion")==="true")d.dataset.motion="reduced"}catch(e){}`,
          }}
        />
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
          <ThemeWelcomePopup />
          <LiquidBackground />
          <FloatingGlassBackground />
          <div className="grain-overlay" />
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
        </ToastProvider>
          </MotionPreferences>
        </ThemeProvider>
      </body>
    </html>
  );
}