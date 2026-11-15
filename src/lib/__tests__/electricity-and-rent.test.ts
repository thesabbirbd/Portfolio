import { describe, it, expect } from "vitest";
import {
  calculateBercElectricityBill,
  calculateIpsAndSolar,
  ApplianceItem,
} from "@/lib/utility/electricity-solar-engine";
import {
  calculateRentReceipt,
  generateToLetWhatsAppUrl,
  generateTenancyAgreement,
  RentReceiptData,
  ToLetPosterData,
} from "@/lib/property/house-rent-engine";

describe("BERC Electricity Bill & Home IPS/Solar Engine (Block 5)", () => {
  it("calculates accurate BERC Lifeline electricity bill (<= 50 kWh)", () => {
    // 40 units * 4.63 Tk = 185.20 Tk energy charge
    // Demand charge (2 kW * 42) = 84 Tk
    // Meter rent = 40 Tk
    // Subtotal = 185.20 + 84 + 40 = 309.20 Tk
    // 5% VAT = 15.46 Tk -> Total = 325 Tk (approx)
    const bill = calculateBercElectricityBill(40, 2, 40);
    expect(bill.totalUnitsKwh).toBe(40);
    expect(bill.slabs.length).toBe(1);
    expect(bill.slabs[0].ratePerUnit).toBe(4.63);
    expect(bill.energyChargeBdt).toBe(185.2);
    expect(bill.demandChargeBdt).toBe(84);
    expect(bill.meterRentBdt).toBe(40);
    expect(bill.totalBillBdt).toBe(325);
  });

  it("calculates multi-tier BERC residential bill across steps for 250 units", () => {
    // 250 units:
    // Step 1: 75 units * 5.26 = 394.50
    // Step 2: 125 units (76-200) * 7.20 = 900.00
    // Step 3: 50 units (201-250) * 7.59 = 379.50
    // Energy charge = 394.50 + 900.00 + 379.50 = 1674.00
    const bill = calculateBercElectricityBill(250, 2, 40);
    expect(bill.totalUnitsKwh).toBe(250);
    expect(bill.slabs.length).toBe(3);
    expect(bill.energyChargeBdt).toBe(1674);
    expect(bill.vat5PercentBdt).toBeGreaterThan(80);
    expect(bill.totalBillBdt).toBeGreaterThan(1800);
  });

  it("calculates Home IPS Inverter VA, Tubular Battery Ah and Solar Panels", () => {
    const apps: ApplianceItem[] = [
      { id: "1", name: "Fan", watts: 75, count: 2, hoursUsedDaily: 10, includeInIps: true }, // 150W
      { id: "2", name: "Light", watts: 15, count: 4, hoursUsedDaily: 6, includeInIps: true }, // 60W
      { id: "3", name: "Router", watts: 10, count: 1, hoursUsedDaily: 24, includeInIps: true }, // 10W
    ]; // Total IPS load = 220 Watts

    const ips = calculateIpsAndSolar(apps, 3, 12);
    expect(ips.ipsConnectedWatts).toBe(220);
    expect(ips.recommendedInverterVa).toBeGreaterThanOrEqual(600);
    expect(ips.batteryRequiredAh).toBeGreaterThan(50);
    expect(ips.recommendedBatteryModel).toContain("টিউবুলার ব্যাটারি");
    expect(ips.recommendedSolarPanels).toBeGreaterThanOrEqual(1);
  });
});

describe("House Rent Receipt & To-Let Poster Engine (Block 5)", () => {
  it("calculates dual-copy rent receipt total with advance deduction and Bangla Taka in words", () => {
    const data: RentReceiptData = {
      receiptNo: "REC-101",
      monthYearBn: "নভেম্বর ২০২৬",
      dateBn: "০৫ নভেম্বর ২০২৬",
      tenantName: "আশরাফুল ইসলাম",
      tenantMobile: "01712345678",
      flatUnitNo: "৪-বি",
      houseAddress: "মিরপুর-১১, ঢাকা",
      landlordName: "শফিকুল হক",
      landlordMobile: "01819876543",
      rentAmount: 20000,
      gasBill: 1080,
      waterBill: 500,
      electricityBill: 1420,
      serviceCharge: 2000,
      arrears: 0,
      advanceDeduction: 5000,
      paymentMethod: "বিকাশ (bKash)",
    };

    // Subtotal = 20000 + 1080 + 500 + 1420 + 2000 = 25000
    // Net total = 25000 - 5000 = 20000
    const calc = calculateRentReceipt(data);
    expect(calc.totalAmountBdt).toBe(20000);
    expect(calc.takaInWordsBn).toContain("বিশ হাজার টাকা মাত্র");
  });

  it("generates WhatsApp click-to-chat QR link with international 880 prefix", () => {
    const poster: ToLetPosterData = {
      title: "TO-LET",
      availableFromBn: "১লা ডিসেম্বর ২০২৬",
      targetTenant: "ফ্যামিলি (Family)",
      flatDetails: {
        bedrooms: 3,
        bathrooms: 3,
        balconies: 2,
        floorNoBn: "৪র্থ তলা",
      },
      features: {
        gasType: "তিতাস লাইন গ্যাস",
        hasLift: true,
        hasGenerator: true,
        hasCctvGuard: true,
        hasCarParking: true,
        hasPrepaidElectricity: true,
      },
      rentAmountBn: "২৫,০০০ টাকা",
      serviceChargeBn: "৩,৫০০ টাকা",
      addressBn: "ধানমন্ডি, ঢাকা",
      contactPhone1: "01712345678",
      whatsappNumber: "01712345678",
    };

    const wa = generateToLetWhatsAppUrl(poster);
    expect(wa).toContain("https://wa.me/8801712345678");
    expect(decodeURIComponent(wa)).toContain("ধানমন্ডি");
  });

  it("generates standard Bangla tenancy agreement with legal clauses", () => {
    const data: RentReceiptData = {
      receiptNo: "REC-101",
      monthYearBn: "নভেম্বর ২০২৬",
      dateBn: "০৫ নভেম্বর ২০২৬",
      tenantName: "আশরাফুল ইসলাম",
      tenantMobile: "01712345678",
      flatUnitNo: "ফ্ল্যাট ৪-বি",
      houseAddress: "মিরপুর-১১, ঢাকা",
      landlordName: "শফিকুল হক",
      landlordMobile: "01819876543",
      rentAmount: 20000,
      gasBill: 1080,
      waterBill: 500,
      electricityBill: 1420,
      serviceCharge: 2000,
      arrears: 0,
      advanceDeduction: 0,
      paymentMethod: "নগদ (Cash)",
    };

    const agreement = generateTenancyAgreement(data);
    expect(agreement).toContain("বাড়ি ভাড়ার চুক্তিপত্র");
    expect(agreement).toContain("আশরাফুল ইসলাম");
    expect(agreement).toContain("শফিকুল হক");
    expect(agreement).toContain("DMP");
  });
});
