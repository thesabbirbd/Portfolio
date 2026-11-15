import { RemittanceCalculatorStudio } from "@/components/tools/RemittanceCalculatorStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Freelancer 2.5% Remittance & Payout Calculator — THE SABBiR OS",
  description:
    "Compare Payoneer, Wise, Direct SWIFT, and bKash payout corridors to Bangladesh Bank with live 2.5% government cash incentives and hidden FX spread calculations.",
  path: "/tools/remittance-calculator",
});

export default function RemittanceCalculatorPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <RemittanceCalculatorStudio />
    </div>
  );
}
