import { HouseRentStudio } from "@/components/tools/HouseRentStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "House Rent Receipt, Printable To-Let Poster & Tenancy Agreement | THE SABBiR",
  description:
    "Generate official dual-copy monthly house rent receipts with Bangla Taka in words, high-contrast printable A4 To-Let posters with WhatsApp QR codes, and tenancy agreements.",
  path: "/tools/house-rent-studio",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "THE SABBiR House Rent Receipt & To-Let Studio",
      "operatingSystem": "All",
      "applicationCategory": "BusinessApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BDT",
      },
      "description":
        "Dual-copy rent receipt with words in Taka, A4 To-Let printable poster with WhatsApp direct QR code, and standard Bangla house rent agreement.",
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "বাড়ি ভাড়ার রশিদে কি গ্যাস ও বিদ্যুৎ বিল আলাদা রাখা উচিত?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "হ্যাঁ, ভবিষ্যতে যেকোনো বিবাদ এড়াতে মূল বাড়ি ভাড়ার সাথে গ্যাস বিল, পানি বিল, বিদ্যুৎ বিল এবং সার্ভিস চার্জ পৃথক লাইনে উল্লেখ করে সর্বমোট টাকার রশিদ প্রদান করা আদর্শ প্রথা।",
          },
        },
        {
          "@type": "Question",
          "name": "টু-লেট পোস্টারে হোয়াটসঅ্যাপ কিউআর কোডের সুবিধা কী?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "রাস্তায় পোস্টার দেখে সম্ভাব্য ভাড়াটিয়াকে মোবাইল নম্বর সেভ করতে হয় না। সরাসরি ক্যামেরা দিয়ে কিউআর স্ক্যান করলেই বাড়িওয়ালার হোয়াটসঅ্যাপে স্বয়ংক্রিয় মেসেজ চলে যায়।",
          },
        },
      ],
    },
  ],
};

export default function HouseRentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <HouseRentStudio />
      </div>
    </>
  );
}
