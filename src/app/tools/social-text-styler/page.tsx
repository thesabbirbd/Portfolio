import { SocialTextStylerStudio } from "@/components/tools/SocialTextStylerStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Unicode Text Styler, Viral Bullets & Social Growth Engine | THE SABBiR",
  description:
    "Convert regular text into 8 bold/italic/monospace Unicode styles for Facebook & LinkedIn, viral bullet decorators, YouTube/Reels tags under 500 chars, and clean UTM URLs.",
  path: "/tools/social-text-styler",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "THE SABBiR Unicode Text Styler & Social Growth Engine",
      "operatingSystem": "All",
      "applicationCategory": "UtilitiesApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BDT",
      },
      "description":
        "Client-side Unicode font generator with 8 math-symbol fonts for Facebook and LinkedIn posts, viral bullet decorators, tags builder and UTM link generator.",
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "ফেসবুক ও লিঙ্কডইন পোস্টে বোল্ড বা ইটালিক লেখা যায় কীভাবে?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ইউনিকোড ম্যাথমেটিকাল অ্যালফানিউমেরিক সিম্বল (Unicode Mathematical Alphanumeric Symbols) ব্যবহার করে সাধারণ ইংরেজি অক্ষরকে বোল্ড, ইটালিক বা মনোস্পেস স্টাইলে রূপান্তর করে যেকোনো সোশ্যাল মিডিয়ায় সরাসরি পেস্ট করা যায়।",
          },
        },
        {
          "@type": "Question",
          "name": "ইউটিউব ও রিলসের এসইও ট্যাগ কত অক্ষরের মধ্যে রাখতে হয়?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ইউটিউব ভিডিও আপলোডে সর্বোচ্চ ৫০০ ক্যারেক্টার পর্যন্ত ট্যাগ সাপোর্ট করে। এই টুলের সাহায্যে একাধিক কি-ওয়ার্ড দিয়ে সর্বোচ্চ ৫০০ ক্যারেক্টারের অপ্টিমাইজড ট্যাগ জেনারেট করা যায়।",
          },
        },
      ],
    },
  ],
};

export default function SocialTextStylerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <SocialTextStylerStudio />
      </div>
    </>
  );
}
