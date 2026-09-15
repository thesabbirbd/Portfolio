import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TerminalModal } from "@/components/ui/TerminalModal";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

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
    "Personal digital identity platform of Md Sabbirul Islam Khan (SABBiR). Bridging Business Management economics with Backend, DevOps, AI, Systems and Infrastructure.",
  keywords: [
    "SABBiR",
    "Md Sabbirul Islam Khan",
    "Omnidesk BD",
    "Backend Engineer",
    "DevOps Engineer",
    "FastAPI",
    "Docker",
    "Ollama",
    "Rajshahi College",
  ],
  authors: [{ name: "Md Sabbirul Islam Khan", url: "https://github.com/thesabbirbd" }],
  creator: "Md Sabbirul Islam Khan",
  publisher: "SABBiR",
  alternates: {
    canonical: "https://sabbir.nav.bd",
  },
  openGraph: {
    title: "Md Sabbirul Islam Khan — SABBiR | Backend • DevOps • AI • Systems",
    description: "Bridging Business Management with Hardcore Systems Engineering.",
    url: "https://sabbir.nav.bd",
    siteName: "SABBiR Digital Platform",
    images: [
      {
        url: "/assets/sabbir-portrait.png",
        width: 800,
        height: 800,
        alt: "Md Sabbirul Islam Khan (SABBiR)",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Md Sabbirul Islam Khan — SABBiR",
    description: "Bridging Business Management with Hardcore Systems Engineering.",
    creator: "@thesabbirbd",
    images: ["/assets/sabbir-portrait.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Md Sabbirul Islam Khan",
  alternateName: "SABBiR",
  url: "https://sabbir.nav.bd",
  image: "https://sabbir.nav.bd/assets/sabbir-portrait.png",
  jobTitle: "Backend & DevOps Systems Architect",
  worksFor: {
    "@type": "Organization",
    name: "Omnidesk BD",
  },
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Rajshahi College",
  },
  sameAs: [
    "https://github.com/thesabbirbd",
    "https://linkedin.com/in/thesabbirbd",
    "https://facebook.com/iamthesabbir",
    "https://x.com/thesabbirbd",
  ],
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
      </body>
    </html>
  );
}
