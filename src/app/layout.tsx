import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TerminalModal } from "@/components/ui/TerminalModal";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sabbir.nav.bd"),
  title: "Md Sabbirul Islam Khan — SABBiR | Backend • DevOps • AI • Systems",
  description:
    "Official digital platform of Md Sabbirul Islam Khan (SABBiR). Bridging Business Management economics with Backend Architecture (FastAPI), DevOps (Docker, Linux), Local AI (Ollama), and NOC Infrastructure. Creator of Omnidesk BD.",
  keywords: [
    "Md Sabbirul Islam Khan",
    "SABBiR",
    "thesabbirbd",
    "iamthesabbir",
    "Omnidesk BD",
    "Backend Engineer Bangladesh",
    "DevOps Architect Rajshahi",
    "FastAPI Python Developer",
    "Docker Containerization",
    "PostgreSQL Database Architect",
    "Linux Ubuntu Specialist",
    "Local AI Ollama Engineer",
    "NOC Network Operations",
    "Mikrotik MTCNA",
    "Rajshahi College BBA Management",
    "National University Bangladesh",
    "Software Systems Architect",
    "Google Local Guide Rajshahi 360",
    "Power Electronics Hardware Hacking",
    "sabbir.nav.bd",
  ],
  authors: [{ name: "Md Sabbirul Islam Khan", url: "https://github.com/thesabbirbd" }],
  creator: "Md Sabbirul Islam Khan (SABBiR)",
  publisher: "SABBiR",
  alternates: {
    canonical: "https://sabbir.nav.bd",
  },
  openGraph: {
    title: "Md Sabbirul Islam Khan — SABBiR | Backend • DevOps • AI • Systems",
    description: "Bridging Business Management with Hardcore Systems Engineering. Creator of Omnidesk BD.",
    url: "https://sabbir.nav.bd",
    siteName: "Md Sabbirul Islam Khan (SABBiR)",
    images: [
      {
        url: "/assets/sabbir-portrait.png",
        width: 800,
        height: 800,
        alt: "Md Sabbirul Islam Khan (SABBiR) - Systems Architect",
      },
    ],
    locale: "en_US",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Md Sabbirul Islam Khan — SABBiR",
    description: "Bridging Business Management with Systems, DevOps, AI & Infrastructure.",
    creator: "@thesabbirbd",
    images: ["/assets/sabbir-portrait.png"],
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
      "alternateName": ["SABBiR", "thesabbirbd", "iamthesabbir"],
      "url": "https://sabbir.nav.bd",
      "image": "https://sabbir.nav.bd/assets/sabbir-portrait.png",
      "jobTitle": "Backend & DevOps Systems Architect",
      "worksFor": {
        "@type": "Organization",
        "name": "Omnidesk BD",
        "url": "https://github.com/thesabbirbd/Omnidesk-BD"
      },
      "alumniOf": [
        {
          "@type": "CollegeOrUniversity",
          "name": "Rajshahi College",
          "sameAs": "https://en.wikipedia.org/wiki/Rajshahi_College"
        },
        {
          "@type": "EducationalOrganization",
          "name": "Hat Gangopara BM Technical College"
        }
      ],
      "knowsAbout": [
        "Backend Architecture",
        "DevOps & Microservices",
        "FastAPI",
        "Docker",
        "PostgreSQL",
        "Linux & GNU Bash",
        "Local LLM Inference (Ollama)",
        "NOC Network Engineering",
        "Mikrotik Routing",
        "Business Management Economics"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Rajshahi",
        "addressCountry": "Bangladesh"
      },
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
      "name": "Md Sabbirul Islam Khan (SABBiR) — Official Platform",
      "description": "Personal digital identity platform of Md Sabbirul Islam Khan (SABBiR).",
      "publisher": {
        "@id": "https://sabbir.nav.bd/#person"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-cyan-500/20 selection:text-cyan-500">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {/* Fast visionOS initializing loading screen */}
          <LoadingScreen />

          {/* Ambient Background Gradients */}
          <div className="fixed inset-0 bg-grid-pattern pointer-events-none -z-20 opacity-70" />
          <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 ambient-radial-glow pointer-events-none -z-10" />

          {/* Navigation Bar */}
          <Navbar />

          {/* Main Content Viewport */}
          <main className="flex-1 w-full relative pt-16 md:pt-24">{children}</main>

          {/* Footer */}
          <Footer />

          {/* Interactive Easter Egg Terminal */}
          <TerminalModal />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
