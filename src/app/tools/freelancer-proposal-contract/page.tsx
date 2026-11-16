import { FreelancerProposalContractStudio } from "@/components/tools/FreelancerProposalContractStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Freelancer Proposal & Bilingual Service Contract Studio — THE SABBiR OS",
  description:
    "Generate winning Upwork/Fiverr bid proposals and bilingual Bangla/English freelance service contracts with 50% advance payment protection.",
  path: "/tools/freelancer-proposal-contract",
  keywords: [
    "freelance proposal",
    "upwork proposal template",
    "freelance contract bangla",
    "service agreement bd",
    "the sabbir os",
  ],
});

export default function FreelancerProposalContractPage() {
  return <FreelancerProposalContractStudio />;
}
