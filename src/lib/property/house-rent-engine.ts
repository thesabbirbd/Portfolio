/**
 * THE SABBiR OS — House Rent Receipt, To-Let Poster & Tenancy Agreement Engine
 * Dual-copy rent receipt, Taka in words, A4 high-contrast To-Let poster with WhatsApp QR.
 */

import { takaInBanglaWords } from "@/lib/banking/taka-in-words";

export interface RentReceiptData {
  receiptNo: string;
  monthYearBn: string; // e.g. "নভেম্বর ২০২৬"
  dateBn: string;
  tenantName: string;
  tenantMobile: string;
  flatUnitNo: string;
  houseAddress: string;
  landlordName: string;
  landlordMobile: string;
  rentAmount: number;
  gasBill: number;
  waterBill: number;
  electricityBill: number;
  serviceCharge: number;
  arrears: number;
  advanceDeduction: number;
  paymentMethod: "নগদ (Cash)" | "বিকাশ (bKash)" | "ব্যাংক ট্রান্সফার (Bank)" | "চেক (Cheque)";
  transactionId?: string;
}

export interface RentReceiptCalculated {
  totalAmountBdt: number;
  takaInWordsBn: string;
}

export function calculateRentReceipt(data: RentReceiptData): RentReceiptCalculated {
  const subtotal =
    (data.rentAmount || 0) +
    (data.gasBill || 0) +
    (data.waterBill || 0) +
    (data.electricityBill || 0) +
    (data.serviceCharge || 0) +
    (data.arrears || 0);

  const totalAmountBdt = Math.max(0, subtotal - (data.advanceDeduction || 0));
  const words = takaInBanglaWords(totalAmountBdt);
  const takaInWordsBn = `${words} টাকা মাত্র`;

  return {
    totalAmountBdt,
    takaInWordsBn,
  };
}

export interface ToLetPosterData {
  title: string; // "TO-LET / বাসা ভাড়া হবে"
  availableFromBn: string; // "১লা ডিসেম্বর ২০২৬ হতে"
  targetTenant: "ফ্যামিলি (Family)" | "ব্যাচেলর (Bachelor)" | "অফিস / বাণিজ্যিক (Commercial)";
  flatDetails: {
    bedrooms: number;
    bathrooms: number;
    balconies: number;
    floorNoBn: string; // "৪র্থ তলা (4th Floor)"
    squareFeet?: number;
  };
  features: {
    gasType: "তিতাস লাইন গ্যাস" | "সিলিন্ডার গ্যাস";
    hasLift: boolean;
    hasGenerator: boolean;
    hasCctvGuard: boolean;
    hasCarParking: boolean;
    hasPrepaidElectricity: boolean;
  };
  rentAmountBn: string; // "২২,০০০ টাকা (আলোচনা সাপেক্ষে)"
  serviceChargeBn: string; // "৩,৫০০ টাকা"
  addressBn: string; // "বাড়ি নং ১২, রোড নং ৫, ধানমন্ডি, ঢাকা"
  contactPhone1: string; // "01712345678"
  contactPhone2?: string;
  whatsappNumber: string; // "01712345678"
}

/**
 * Builds direct WhatsApp click-to-chat QR code URL
 */
export function generateToLetWhatsAppUrl(poster: ToLetPosterData): string {
  const cleanPhone = poster.whatsappNumber.replace(/[^\d]/g, "");
  const intlPhone = cleanPhone.startsWith("88")
    ? cleanPhone
    : cleanPhone.startsWith("0")
    ? `88${cleanPhone}`
    : `880${cleanPhone}`;

  const message = encodeURIComponent(
    `আসসালামু আলাইকুম। আপনার "${poster.addressBn}" ঠিকানার টু-লেট বিজ্ঞাপনটি দেখে যোগাযোগ করছি। বাসাটি কি এখনো ভাড়া দেওয়া বাকি আছে?`
  );

  return `https://wa.me/${intlPhone}?text=${message}`;
}

/**
 * Standard Bangladeshi Tenancy Agreement Template
 */
export function generateTenancyAgreement(data: RentReceiptData): string {
  return `গণপ্রজাতন্ত্রী বাংলাদেশ
বাড়ি ভাড়ার চুক্তিপত্র (Tenancy Agreement)

১ম পক্ষ (মালিক):
নাম: ${data.landlordName}
মোবাইল: ${data.landlordMobile}
ঠিকানা: ${data.houseAddress}

২য় পক্ষ (ভাড়াটিয়া):
নাম: ${data.tenantName}
মোবাইল: ${data.tenantMobile}
ভাড়াকৃত ফ্ল্যাট: ${data.flatUnitNo}

শর্তাবলী:
১. এই চুক্তিপত্রের মেয়াদ আগামী ০১ (এক) বছরের জন্য বলবৎ থাকিবে।
২. মাসিক ভাড়া বাবদ সর্বমোট ৳ ${data.rentAmount.toLocaleString("bn-BD")} (টাকা কথায়: ${takaInBanglaWords(data.rentAmount)} টাকা মাত্র) ধার্য করা হইল।
৩. প্রতি ইংরেজি মাসের ০১ হতে ১০ তারিখের মধ্যে উক্ত ভাড়া ১ম পক্ষের নিকট পরিশোধ করিতে হইবে।
৪. জামানত/অগ্রিম বাবদ ভাড়াটিয়া মালিককে ২ (দুই) মাসের ভাড়া সমপরিমাণ টাকা অগ্রিম প্রদান করিলেন, যাহা বাসা ছাড়ার সময় সমন্বয় অথবা ফেরতযোগ্য।
৫. বাসা ছাড়ার পূর্বে উভয় পক্ষকে অন্তত ২ (দুই) মাস পূর্বে লিখিত নোটিশ প্রদান করিতে হইবে।
৬. ফ্ল্যাটে কোনো প্রকার অসামাজিক বা রাষ্ট্রবিরোধী কার্যকলাপ করা যাইবে না।
৭. ঢাকা মেট্রোপলিটন পুলিশ (DMP) নির্দেশিত ভাড়াটিয়া নিবন্ধন ফরম পূরণপূর্বক থানায় জমা দেওয়া বাধ্যতামূলক।

স্বাক্ষীগণের স্বাক্ষর:                      ১ম পক্ষের স্বাক্ষর (মালিক):
১. ___________________                  _________________________
২. ___________________                  ২য় পক্ষের স্বাক্ষর (ভাড়াটিয়া):
                                        _________________________`;
}

/**
 * Sample Preset: Mirpur 2 Bed Family Apartment
 */
export const SAMPLE_RENT_DATA: RentReceiptData = {
  receiptNo: "REC-2026-118",
  monthYearBn: "নভেম্বর ২০২৬",
  dateBn: "০৫ নভেম্বর ২০২৬",
  tenantName: "মোহাম্মদ আশরাফুল ইসলাম",
  tenantMobile: "01712345678",
  flatUnitNo: "ফ্ল্যাট ৪-বি (৪র্থ তলা)",
  houseAddress: "বাড়ি নং ৪২, রোড নং ৭, মিরপুর-১১, ঢাকা",
  landlordName: "আলহাজ্ব শফিকুল হক",
  landlordMobile: "01819876543",
  rentAmount: 18000,
  gasBill: 1080,
  waterBill: 600,
  electricityBill: 1850,
  serviceCharge: 2500,
  arrears: 0,
  advanceDeduction: 0,
  paymentMethod: "বিকাশ (bKash)",
  transactionId: "BK9X4029LA",
};

export const SAMPLE_TOLET_DATA: ToLetPosterData = {
  title: "TO-LET / বাসা ভাড়া হবে",
  availableFromBn: "১লা ডিসেম্বর ২০২৬ হতে",
  targetTenant: "ফ্যামিলি (Family)",
  flatDetails: {
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    floorNoBn: "৪র্থ তলা (লিফট-৩)",
    squareFeet: 1350,
  },
  features: {
    gasType: "তিতাস লাইন গ্যাস",
    hasLift: true,
    hasGenerator: true,
    hasCctvGuard: true,
    hasCarParking: true,
    hasPrepaidElectricity: true,
  },
  rentAmountBn: "২২,০০০ টাকা (আলোচনা সাপেক্ষে)",
  serviceChargeBn: "৩,৫০০ টাকা (পানি ও নিরাপত্তা সহ)",
  addressBn: "বাড়ি নং ৫৪, রোড নং ৯, সেক্টর-৪, উত্তরা, ঢাকা",
  contactPhone1: "01711223344",
  contactPhone2: "01999887766",
  whatsappNumber: "01711223344",
};
