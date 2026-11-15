/**
 * THE SABBiR OS — Exact Job Age Calculator, BMI/BMR Health & Emergency Medical ID
 * Exact calendar age in Years/Months/Days, BCS 32y cutoff validation,
 * Mifflin-St Jeor BMR/TDEE, Asian-Pacific BMI, and printable wallet medical ID.
 */

export interface ExactAgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  formattedBn: string;
  isBcsEligible: boolean; // General cutoff: <= 32 years
  bcsCutoffAgeLimitYears: number;
  daysUntilCutoff: number;
  cutoffStatusBn: string;
}

/**
 * Calculates exact calendar age in Years, Months, and Days from Birthdate to Target date.
 */
export function calculateExactAge(
  birthDateStr: string,
  targetDateStr: string = new Date().toISOString().split("T")[0],
  cutoffLimitYears: number = 32
): ExactAgeResult {
  const birth = new Date(birthDateStr);
  const target = new Date(targetDateStr);

  if (isNaN(birth.getTime()) || isNaN(target.getTime())) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      formattedBn: "সঠিক তারিখ দিন",
      isBcsEligible: false,
      bcsCutoffAgeLimitYears: cutoffLimitYears,
      daysUntilCutoff: 0,
      cutoffStatusBn: "অবৈধ তারিখ",
    };
  }

  let years = target.getFullYear() - birth.getFullYear();
  let months = target.getMonth() - birth.getMonth();
  let days = target.getDate() - birth.getDate();

  if (days < 0) {
    // Borrow days from previous month of target
    const prevMonthDays = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
    days += prevMonthDays;
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  const diffMs = target.getTime() - birth.getTime();
  const totalDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  const formattedBn = `${years} বছর ${months} মাস ${days} দিন`;

  // BCS Cutoff calculation (32 years)
  const cutoffDate = new Date(birth);
  cutoffDate.setFullYear(birth.getFullYear() + cutoffLimitYears);
  const msUntilCutoff = cutoffDate.getTime() - target.getTime();
  const daysUntilCutoff = Math.floor(msUntilCutoff / (1000 * 60 * 60 * 24));

  const isBcsEligible = years < cutoffLimitYears || (years === cutoffLimitYears && months === 0 && days === 0);

  let cutoffStatusBn = "";
  if (isBcsEligible) {
    cutoffStatusBn = `চাকরিতে আবেদনের উপযুক্ত (বয়সসীমা ${cutoffLimitYears} বছর অতিক্রম করেনি)। আরও ${daysUntilCutoff} দিন বাকি।`;
  } else {
    cutoffStatusBn = `বয়সসীমা উত্তীর্ণ (${cutoffLimitYears} বছরের সাধারণ কোটা অতিক্রম করেছে)।`;
  }

  return {
    years,
    months,
    days,
    totalDays,
    formattedBn,
    isBcsEligible,
    bcsCutoffAgeLimitYears: cutoffLimitYears,
    daysUntilCutoff,
    cutoffStatusBn,
  };
}

export interface BmiBmrInput {
  gender: "male" | "female";
  ageYears: number;
  heightCm: number;
  weightKg: number;
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
}

export interface BmiBmrResult {
  bmi: number;
  bmiClassificationBn: string;
  bmiCategory: "underweight" | "normal" | "overweight" | "obese";
  bmrCalories: number;
  tdeeCalories: number;
  idealWeightRangeKg: [number, number];
  dailyWaterLiters: number;
}

/**
 * Calculates BMI (Asian-Pacific WHO) and Mifflin-St Jeor BMR / TDEE.
 */
export function calculateBmiAndBmr(input: BmiBmrInput): BmiBmrResult {
  const { gender, ageYears, heightCm, weightKg, activityLevel } = input;
  const heightM = heightCm / 100;
  const rawBmi = weightKg / (heightM * heightM);
  const bmi = Math.round(rawBmi * 10) / 10;

  // Asian-Pacific WHO cutoffs
  let bmiCategory: BmiBmrResult["bmiCategory"] = "normal";
  let bmiClassificationBn = "আদর্শ ওজন (Normal)";

  if (bmi < 18.5) {
    bmiCategory = "underweight";
    bmiClassificationBn = "কম ওজন (Underweight)";
  } else if (bmi <= 22.9) {
    bmiCategory = "normal";
    bmiClassificationBn = "আদর্শ ওজন (Normal Weight)";
  } else if (bmi <= 24.9) {
    bmiCategory = "overweight";
    bmiClassificationBn = "অতিরিক্ত ওজন (Overweight)";
  } else {
    bmiCategory = "obese";
    bmiClassificationBn = "স্থূলতা (Obese)";
  }

  // Mifflin-St Jeor Formula
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  bmr += gender === "male" ? 5 : -161;
  const bmrCalories = Math.round(bmr);

  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const tdeeCalories = Math.round(bmrCalories * multipliers[activityLevel]);
  const idealMin = Math.round(18.5 * heightM * heightM * 10) / 10;
  const idealMax = Math.round(22.9 * heightM * heightM * 10) / 10;
  const dailyWaterLiters = Math.round(weightKg * 0.033 * 10) / 10;

  return {
    bmi,
    bmiClassificationBn,
    bmiCategory,
    bmrCalories,
    tdeeCalories,
    idealWeightRangeKg: [idealMin, idealMax],
    dailyWaterLiters,
  };
}

export interface EmergencyMedicalIdData {
  fullName: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  birthDate: string;
  nationalIdNo?: string;
  allergies: string; // e.g. "Penicillin, Dust"
  chronicConditions: string; // e.g. "Diabetes Type-2, Hypertension"
  emergencyContactName: string;
  emergencyContactPhone: string;
  relationWithContact: string; // e.g. "পিতা / Brother"
  currentMedications: string; // e.g. "Metformin 500mg, Losartan 50mg"
}

export const SAMPLE_MEDICAL_ID: EmergencyMedicalIdData = {
  fullName: "মোহাম্মদ আশিকুর রহমান",
  bloodGroup: "B+",
  birthDate: "1996-08-15",
  nationalIdNo: "1996269201827402",
  allergies: "পেনিসিলিন ও সালফা ড্রাগ এলার্জি",
  chronicConditions: "উচ্চ রক্তচাপ (Hypertension)",
  emergencyContactName: "মোঃ রফিকুল ইসলাম (বড় ভাই)",
  emergencyContactPhone: "01712345678",
  relationWithContact: "সহোদর ভাই (Brother)",
  currentMedications: "Amlodipine 5mg (প্রতিদিন সকালে)",
};
