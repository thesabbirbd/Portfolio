import { FamilyBudgetZakatStudio } from "@/components/tools/FamilyBudgetZakatStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Family Monthly Hisab, Bank DPS/FDR & Islamic Zakat Studio | THE SABBiR",
  description:
    "50/30/20 Family monthly expense budgeting, bank DPS/FDR maturity tax calculator, and authentic Islamic Zakat & BAJUS gold/silver Nisab calculator at 2.5%.",
  path: "/tools/family-budget-zakat",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "THE SABBiR Family Monthly Budget & Islamic Zakat Studio",
      "operatingSystem": "All",
      "applicationCategory": "FinanceApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BDT",
      },
      "description":
        "Household 50/30/20 cashflow hisab, bank DPS maturity calculation with TIN tax, and authentic BAJUS 7.5 vori gold / 52.5 vori silver Nisab Zakat math.",
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "যাকাতের নেসাব কত ভরি স্বর্ণ বা রূপা?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "শরীয়ত অনুযায়ী স্বর্ণের নেসাব হলো ৭.৫ ভরি (টলা) বা ৮৭.৪৮ গ্রাম এবং রূপার নেসাব হলো ৫২.৫ ভরি বা ৬১২.৩৬ গ্রাম। বর্তমানে অধিকাংশ ফকিহ রূপার মানদণ্ড অনুযায়ী হিসাব করতে পরামর্শ দেন যাতে দরিদ্ররা অধিক উপকৃত হয়।",
          },
        },
        {
          "@type": "Question",
          "name": "ব্যাংক ডিপিএস বা এফডিআর এ কত শতাংশ ট্যাক্স কাটা হয়?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "যদি গ্রাহকের ই-টিন (TIN) সার্টিফিকেট ব্যাংকে জমা দেওয়া থাকে তবে মুনাফার ওপর ১০% হারে উৎস কর কর্তন করা হয়। টিন না থাকলে ১৫% কর কাটা হয়।",
          },
        },
      ],
    },
  ],
};

export default function FamilyBudgetZakatPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <FamilyBudgetZakatStudio />
      </div>
    </>
  );
}
