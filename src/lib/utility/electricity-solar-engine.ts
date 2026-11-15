/**
 * THE SABBiR OS — BD Electricity Bill (BERC LT-A Slab) & Home IPS/Solar Sizer
 * Official Bangladesh Energy Regulatory Commission step tariffs, room appliance load inventory,
 * and Inverter VA & Tubular Battery Ah sizing.
 */

export interface BercSlabBreakdown {
  slabName: string;
  unitsInSlab: number;
  ratePerUnit: number;
  costBdt: number;
}

export interface ElectricityBillResult {
  totalUnitsKwh: number;
  slabs: BercSlabBreakdown[];
  energyChargeBdt: number;
  demandChargeBdt: number;
  meterRentBdt: number;
  subtotalBdt: number;
  vat5PercentBdt: number;
  totalBillBdt: number;
}

/**
 * Calculates official BERC Residential LT-A step-tariff electricity bill.
 * Slabs:
 * - Lifeline (0 - 50 kWh): 4.63 Tk/unit (Only if total consumption <= 50)
 * - 0 - 75 kWh: 5.26 Tk/unit
 * - 76 - 200 kWh: 7.20 Tk/unit
 * - 201 - 300 kWh: 7.59 Tk/unit
 * - 301 - 400 kWh: 8.02 Tk/unit
 * - 401 - 600 kWh: 12.67 Tk/unit
 * - Above 600 kWh: 14.61 Tk/unit
 * Plus: Demand charge (Tk 42/kW), Meter rent (Tk 40), 5% VAT.
 */
export function calculateBercElectricityBill(
  unitsKwh: number,
  sanctionedLoadKw: number = 2,
  meterRentBdt: number = 40
): ElectricityBillResult {
  const units = Math.max(0, unitsKwh);
  const slabs: BercSlabBreakdown[] = [];
  let energyCharge = 0;

  if (units <= 50) {
    // Lifeline slab
    const cost = units * 4.63;
    slabs.push({
      slabName: "লাইফ-লাইন (০-৫০ ইউনিট)",
      unitsInSlab: units,
      ratePerUnit: 4.63,
      costBdt: Math.round(cost * 100) / 100,
    });
    energyCharge = cost;
  } else {
    let remaining = units;

    // Step 1: 0 - 75
    const u1 = Math.min(remaining, 75);
    const c1 = u1 * 5.26;
    slabs.push({
      slabName: "ধাপ ১ (১-৭৫ ইউনিট)",
      unitsInSlab: u1,
      ratePerUnit: 5.26,
      costBdt: Math.round(c1 * 100) / 100,
    });
    energyCharge += c1;
    remaining -= u1;

    // Step 2: 76 - 200 (125 units capacity)
    if (remaining > 0) {
      const u2 = Math.min(remaining, 125);
      const c2 = u2 * 7.2;
      slabs.push({
        slabName: "ধাপ ২ (৭৬-২০০ ইউনিট)",
        unitsInSlab: u2,
        ratePerUnit: 7.2,
        costBdt: Math.round(c2 * 100) / 100,
      });
      energyCharge += c2;
      remaining -= u2;
    }

    // Step 3: 201 - 300 (100 units capacity)
    if (remaining > 0) {
      const u3 = Math.min(remaining, 100);
      const c3 = u3 * 7.59;
      slabs.push({
        slabName: "ধাপ ৩ (২০১-৩০০ ইউনিট)",
        unitsInSlab: u3,
        ratePerUnit: 7.59,
        costBdt: Math.round(c3 * 100) / 100,
      });
      energyCharge += c3;
      remaining -= u3;
    }

    // Step 4: 301 - 400 (100 units capacity)
    if (remaining > 0) {
      const u4 = Math.min(remaining, 100);
      const c4 = u4 * 8.02;
      slabs.push({
        slabName: "ধাপ ৪ (৩০১-৪০০ ইউনিট)",
        unitsInSlab: u4,
        ratePerUnit: 8.02,
        costBdt: Math.round(c4 * 100) / 100,
      });
      energyCharge += c4;
      remaining -= u4;
    }

    // Step 5: 401 - 600 (200 units capacity)
    if (remaining > 0) {
      const u5 = Math.min(remaining, 200);
      const c5 = u5 * 12.67;
      slabs.push({
        slabName: "ধাপ ৫ (৪০১-৬০০ ইউনিট)",
        unitsInSlab: u5,
        ratePerUnit: 12.67,
        costBdt: Math.round(c5 * 100) / 100,
      });
      energyCharge += c5;
      remaining -= u5;
    }

    // Step 6: Above 600
    if (remaining > 0) {
      const c6 = remaining * 14.61;
      slabs.push({
        slabName: "ধাপ ৬ (৬০১+ ইউনিট)",
        unitsInSlab: remaining,
        ratePerUnit: 14.61,
        costBdt: Math.round(c6 * 100) / 100,
      });
      energyCharge += c6;
      remaining = 0;
    }
  }

  const demandCharge = Math.max(0, sanctionedLoadKw) * 42;
  const subtotal = energyCharge + demandCharge + meterRentBdt;
  const vat = subtotal * 0.05;
  const total = subtotal + vat;

  return {
    totalUnitsKwh: units,
    slabs,
    energyChargeBdt: Math.round(energyCharge * 100) / 100,
    demandChargeBdt: demandCharge,
    meterRentBdt,
    subtotalBdt: Math.round(subtotal * 100) / 100,
    vat5PercentBdt: Math.round(vat * 100) / 100,
    totalBillBdt: Math.round(total),
  };
}

export interface ApplianceItem {
  id: string;
  name: string;
  watts: number;
  count: number;
  hoursUsedDaily: number;
  includeInIps: boolean;
}

export interface IpsSolarResult {
  totalRunningWatts: number;
  ipsConnectedWatts: number;
  recommendedInverterVa: number;
  recommendedInverterSize: string;
  backupHoursDesired: number;
  batteryRequiredAh: number;
  recommendedBatteryModel: string;
  recommendedBatteryCount: number;
  monthlyTotalKwh: number;
  recommendedSolarKwp: number;
  recommendedSolarPanels: number;
}

/**
 * Calculates Home IPS Inverter VA, Tubular Battery Ah, and Rooftop Solar kWp.
 * Inverter VA = Running Watts / 0.8 PF * 1.25 safety headroom
 * Battery Ah = (Watts * Backup Hours) / (Voltage 12V * 0.8 DoD * 0.85 Efficiency)
 */
export function calculateIpsAndSolar(
  appliances: ApplianceItem[],
  desiredBackupHours: number = 3,
  systemVoltage: number = 12
): IpsSolarResult {
  let totalRunningWatts = 0;
  let ipsConnectedWatts = 0;
  let dailyKwhTotal = 0;

  for (const a of appliances) {
    const activeW = a.watts * a.count;
    totalRunningWatts += activeW;
    dailyKwhTotal += (activeW * a.hoursUsedDaily) / 1000;

    if (a.includeInIps) {
      ipsConnectedWatts += activeW;
    }
  }

  const monthlyKwh = Math.round(dailyKwhTotal * 30);

  // Inverter Sizing
  const rawVa = (ipsConnectedWatts / 0.8) * 1.25;
  let recommendedInverterVa = 600;
  let recommendedInverterSize = "600 VA (0.6 kVA)";

  if (rawVa > 2000) {
    recommendedInverterVa = 3000;
    recommendedInverterSize = "3000 VA (3.0 kVA / 24V)";
  } else if (rawVa > 1200) {
    recommendedInverterVa = 2000;
    recommendedInverterSize = "2000 VA (2.0 kVA / 24V)";
  } else if (rawVa > 800) {
    recommendedInverterVa = 1200;
    recommendedInverterSize = "1200 VA (1.2 kVA / 12V)";
  } else if (rawVa > 600) {
    recommendedInverterVa = 800;
    recommendedInverterSize = "800 VA (0.8 kVA / 12V)";
  }

  // Battery Ah Sizing
  const effectiveVoltage = ipsConnectedWatts > 1200 ? 24 : systemVoltage;
  const batteryCount = effectiveVoltage === 24 ? 2 : 1;
  const energyNeededWh = ipsConnectedWatts * desiredBackupHours;
  const rawAh = energyNeededWh / (effectiveVoltage * 0.8 * 0.85);

  let recommendedBatteryModel = "130 Ah টিউবুলার ব্যাটারি";
  if (rawAh > 180) {
    recommendedBatteryModel = "200 Ah হাই-ক্যাপাসিটি টিউবুলার ব্যাটারি";
  } else if (rawAh > 130) {
    recommendedBatteryModel = "150 Ah স্ট্যান্ডার্ড টিউবুলার ব্যাটারি";
  }

  // Solar kWp Sizing (average 4.5 peak sun hours in BD)
  const dailyKwhAvg = monthlyKwh / 30;
  const solarKwp = Math.round((dailyKwhAvg / 4.5) * 100) / 100;
  const solarPanels = Math.max(1, Math.ceil((solarKwp * 1000) / 350)); // 350W mono panels

  return {
    totalRunningWatts,
    ipsConnectedWatts,
    recommendedInverterVa,
    recommendedInverterSize,
    backupHoursDesired: desiredBackupHours,
    batteryRequiredAh: Math.round(rawAh),
    recommendedBatteryModel,
    recommendedBatteryCount: batteryCount,
    monthlyTotalKwh: monthlyKwh,
    recommendedSolarKwp: solarKwp,
    recommendedSolarPanels: solarPanels,
  };
}

/**
 * Standard BD Apartment Appliance Presets
 */
export const DEFAULT_APPLIANCES: ApplianceItem[] = [
  { id: "1", name: "সিলিং ফ্যান (Ceiling Fan)", watts: 75, count: 3, hoursUsedDaily: 12, includeInIps: true },
  { id: "2", name: "এলইডি লাইট (LED Light)", watts: 15, count: 6, hoursUsedDaily: 6, includeInIps: true },
  { id: "3", name: "ওয়াইফাই রাউটার (WiFi Router)", watts: 12, count: 1, hoursUsedDaily: 24, includeInIps: true },
  { id: "4", name: "স্মার্ট টিভি (Smart LED TV)", watts: 80, count: 1, hoursUsedDaily: 4, includeInIps: false },
  { id: "5", name: "রেফ্রিজারেটর (Fridge)", watts: 200, count: 1, hoursUsedDaily: 10, includeInIps: false },
  { id: "6", name: "ল্যাপটপ / কম্পিউটার (Laptop)", watts: 65, count: 1, hoursUsedDaily: 8, includeInIps: true },
];
