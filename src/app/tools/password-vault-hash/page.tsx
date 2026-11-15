import { PasswordVaultHashStudio } from "@/components/tools/PasswordVaultHashStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Crypto Vault, Diceware Passphrase & SHA-256 Checksum Studio | THE SABBiR",
  description:
    "Zero-knowledge in-browser Diceware passphrase generator, Shannon bit entropy crack-time estimator, client-side AES-256-GCM secret note seal/unseal, and SHA-256 file checksum verifier.",
  path: "/tools/password-vault-hash",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "THE SABBiR Crypto Vault & Checksum Studio",
      "operatingSystem": "All",
      "applicationCategory": "SecurityApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BDT",
      },
      "description":
        "In-browser zero-server password generator with English and Romanized Bangla Diceware wordlists, bit-entropy calculation, AES-256-GCM secret note vault and WebCrypto SHA-256 file verifier.",
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "ডাইসওয়্যার (Diceware) পাসফ্রেজ কীভাবে কাজ করে?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ডাইসওয়্যার পদ্ধতিতে ক্রিপ্টোগ্রাফিক র‍্যান্ডম সিলেকশনের মাধ্যমে একাধিক অর্থপূর্ণ বাংলা ও ইংরেজি শব্দ যুক্ত করে একটি দীর্ঘ ও সহজে মনে রাখার মতো কিন্তু ব্রুট-ফোর্স অ্যাটাকে ভাঙা অসম্ভব এমন পাসফ্রেজ তৈরি করা হয়।",
          },
        },
        {
          "@type": "Question",
          "name": "এই টুলে কোনো পাসওয়ার্ড বা ফাইল কি সার্ভারে সেভ হয়?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "একদমই না। সম্পূর্ণ এনক্রিপশন ও হ্যাশ ক্যালকুলেশন ব্রাউজারের নিজস্ব WebCrypto API দিয়ে ক্লায়েন্ট সাইডে সম্পন্ন হয়, কোনো ডাটা ইন্টারনেটে যায় না।",
          },
        },
      ],
    },
  ],
};

export default function PasswordVaultHashPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <PasswordVaultHashStudio />
      </div>
    </>
  );
}
