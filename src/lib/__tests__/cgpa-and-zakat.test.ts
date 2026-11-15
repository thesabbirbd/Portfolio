import { describe, it, expect } from "vitest";
import {
  calculateSscHscGpa,
  calculateUniversityCgpa,
  predictRequiredGpa,
  calculateFullDegreeProgress,
  DEGREE_PROGRAMS,
  BoardSubject,
  UniversityCourse,
} from "@/lib/education/cgpa-grade-engine";
import {
  calculateFamilyBudget,
  calculateDpsFdrMaturity,
  calculateIslamicZakat,
  calculateExciseDuty,
  FamilyBudgetInput,
} from "@/lib/finance/family-zakat-engine";

describe("SSC/HSC & University CGPA Engine (Block 4)", () => {
  it("calculates accurate SSC GPA with 4th subject bonus points", () => {
    // 8 mandatory subjects: 7 are A (4.00), 1 is A- (3.50). Total = 31.50
    // 4th subject is A+ (5.00). Bonus = 5.00 - 2.00 = +3.00
    // Total points = 31.50 + 3.00 = 34.50 / 8 = 4.3125 -> 4.31
    const subjects: BoardSubject[] = [
      { id: "1", name: "Bangla", grade: "A" },
      { id: "2", name: "English", grade: "A" },
      { id: "3", name: "Math", grade: "A" },
      { id: "4", name: "Physics", grade: "A" },
      { id: "5", name: "Chemistry", grade: "A" },
      { id: "6", name: "Biology", grade: "A" },
      { id: "7", name: "BGS", grade: "A" },
      { id: "8", name: "Religion", grade: "A-" },
      { id: "9", name: "Higher Math (4th)", grade: "A+", isFourthSubject: true },
    ];

    const result = calculateSscHscGpa(subjects);
    expect(result.mandatoryCount).toBe(8);
    expect(result.fourthSubjectBonus).toBe(3.0);
    expect(result.calculatedGpa).toBe(4.31);
    expect(result.letterGrade).toBe("A");
    expect(result.isGoldenAPlus).toBe(false);
    expect(result.hasFail).toBe(false);
  });

  it("detects authentic Golden A+ when all mandatory subjects are A+ and GPA is 5.00", () => {
    const subjects: BoardSubject[] = [
      { id: "1", name: "Bangla", grade: "A+" },
      { id: "2", name: "English", grade: "A+" },
      { id: "3", name: "Math", grade: "A+" },
      { id: "4", name: "Physics", grade: "A+" },
      { id: "5", name: "Chemistry", grade: "A+" },
      { id: "6", name: "Biology", grade: "A+" },
      { id: "7", name: "BGS", grade: "A+" },
      { id: "8", name: "Religion", grade: "A+" },
      { id: "9", name: "Higher Math", grade: "A+", isFourthSubject: true },
    ];

    const result = calculateSscHscGpa(subjects);
    expect(result.calculatedGpa).toBe(5.0);
    expect(result.isGoldenAPlus).toBe(true);
    expect(result.summaryBn).toContain("গোল্ডেন A+");
  });

  it("returns 0.00 GPA (Fail) if any mandatory subject is F", () => {
    const subjects: BoardSubject[] = [
      { id: "1", name: "Bangla", grade: "A+" },
      { id: "2", name: "English", grade: "F" },
      { id: "3", name: "Math", grade: "A+" },
    ];

    const result = calculateSscHscGpa(subjects);
    expect(result.calculatedGpa).toBe(0.0);
    expect(result.hasFail).toBe(true);
    expect(result.letterGrade).toBe("F");
  });

  it("calculates credit-weighted university semester CGPA correctly", () => {
    // 3 credits * 4.0 = 12, 3 credits * 3.0 = 9. Total credits = 6, points = 21 / 6 = 3.50
    const courses: UniversityCourse[] = [
      { id: "c1", name: "Algorithms", credits: 3.0, gradePoint: 4.0 },
      { id: "c2", name: "Database", credits: 3.0, gradePoint: 3.0 },
    ];

    const result = calculateUniversityCgpa(courses);
    expect(result.totalCredits).toBe(6.0);
    expect(result.cgpa).toBe(3.5);
    expect(result.letterGrade).toBe("A-");
  });

  it("predicts required remaining GPA and detects unachievable targets", () => {
    // Completed 60 credits with 3.20. Remaining 60 credits. Target 3.50.
    // Total credits = 120 * 3.5 = 420. Current = 60 * 3.2 = 192.
    // Required = (420 - 192) / 60 = 228 / 60 = 3.80
    const target1 = predictRequiredGpa({
      currentCgpa: 3.2,
      completedCredits: 60,
      targetCgpa: 3.5,
      remainingCredits: 60,
    });

    expect(target1.requiredGpa).toBe(3.8);
    expect(target1.isAchievable).toBe(true);

    // Impossible target (requires > 4.00)
    const targetImpossible = predictRequiredGpa({
      currentCgpa: 2.5,
      completedCredits: 100,
      targetCgpa: 3.8,
      remainingCredits: 20,
    });

    expect(targetImpossible.isAchievable).toBe(false);
    expect(targetImpossible.requiredGpa).toBeGreaterThan(4.0);
  });

  it("provides comprehensive Bangladeshi 4-year degree programs (BSc, BBA, BA, Diploma)", () => {
    expect(DEGREE_PROGRAMS.bsc_cse).toBeDefined();
    expect(DEGREE_PROGRAMS.bba_core).toBeDefined();
    expect(DEGREE_PROGRAMS.ba_english).toBeDefined();
    expect(DEGREE_PROGRAMS.diploma_computer).toBeDefined();

    // Check categories
    expect(DEGREE_PROGRAMS.bsc_cse.category).toBe("BSC");
    expect(DEGREE_PROGRAMS.bba_core.category).toBe("BBA");
    expect(DEGREE_PROGRAMS.ba_english.category).toBe("BA");
    expect(DEGREE_PROGRAMS.diploma_computer.category).toBe("DIPLOMA");

    // Check 8 semesters / 4 years structure
    expect(DEGREE_PROGRAMS.bsc_cse.semesters.length).toBe(8);
    expect(DEGREE_PROGRAMS.bba_core.semesters.length).toBe(8);
    expect(DEGREE_PROGRAMS.ba_english.semesters.length).toBe(8);
    expect(DEGREE_PROGRAMS.diploma_computer.semesters.length).toBe(8);

    // Verify course code & course name presence in Year 1 Semester 1
    const s1Courses = DEGREE_PROGRAMS.bsc_cse.semesters[0].courses;
    expect(s1Courses.length).toBeGreaterThan(0);
    expect(s1Courses[0].code).toBeDefined();
    expect(s1Courses[0].name).toBeDefined();
    expect(s1Courses[0].credits).toBeGreaterThan(0);
  });

  it("provides comprehensive National University (NU) Honours programs (Rajshahi College & affiliated)", () => {
    // Check NU Departments
    expect(DEGREE_PROGRAMS.nu_political_science).toBeDefined();
    expect(DEGREE_PROGRAMS.nu_sociology).toBeDefined();
    expect(DEGREE_PROGRAMS.nu_accounting).toBeDefined();
    expect(DEGREE_PROGRAMS.nu_physics).toBeDefined();
    expect(DEGREE_PROGRAMS.nu_chemistry).toBeDefined();
    expect(DEGREE_PROGRAMS.nu_bangla).toBeDefined();
    expect(DEGREE_PROGRAMS.nu_history).toBeDefined();

    // Verify Category
    expect(DEGREE_PROGRAMS.nu_political_science.category).toBe("NU");
    expect(DEGREE_PROGRAMS.nu_political_science.categoryLabelBn).toContain("জাতীয় বিশ্ববিদ্যালয়");

    // Verify 8 semesters (4 years) structure
    expect(DEGREE_PROGRAMS.nu_political_science.semesters.length).toBe(8);

    // Verify 6-digit NU official codes (21xxxx in year 1, 24xxxx in year 4)
    const y1Courses = DEGREE_PROGRAMS.nu_political_science.semesters[0].courses;
    expect(y1Courses[0].code).toMatch(/^21/);
    expect(y1Courses[0].name).toContain("/");

    const y4Courses = DEGREE_PROGRAMS.nu_political_science.semesters[7].courses;
    expect(y4Courses[0].code).toMatch(/^24/);
    expect(y4Courses[0].name).toContain("/");
  });

  it("calculates multi-year cumulative CGPA progression and letter grades correctly", () => {
    // Build a map of semesters for BSc CSE
    const program = DEGREE_PROGRAMS.bsc_cse;
    const semestersCoursesMap: Record<number, any[]> = {};

    program.semesters.forEach((sem) => {
      // Assign 4.00 (A+) to all courses in Year 1 (semesters 1 & 2)
      if (sem.semesterNumber <= 2) {
        semestersCoursesMap[sem.semesterNumber] = sem.courses.map((c) => ({
          ...c,
          gradePoint: 4.0,
        }));
      } else {
        semestersCoursesMap[sem.semesterNumber] = sem.courses.map((c) => ({
          ...c,
          gradePoint: 0.0,
        }));
      }
    });

    const progress = calculateFullDegreeProgress("bsc_cse", semestersCoursesMap);
    expect(progress.years[0].yearGpa).toBe(4.0);
    expect(progress.years[0].cumulativeCgpa).toBe(4.0);
    expect(progress.overallCgpa).toBeGreaterThan(0);
    expect(progress.totalDegreeCreditsCompleted).toBeGreaterThan(0);
    expect(progress.standingBn).toBeDefined();
  });
});

describe("Family Budget & Islamic Zakat Engine (Block 4)", () => {
  it("calculates 50/30/20 budget breakdown, surplus, and health grade", () => {
    const input: FamilyBudgetInput = {
      monthlyIncome: 100000,
      needs: {
        houseRent: 25000,
        groceryBazar: 15000,
        utilityBills: 5000,
        educationFees: 5000,
        medicalHealth: 0,
        otherNeeds: 0,
      }, // 50,000 (50%)
      wants: {
        diningOut: 5000,
        entertainment: 5000,
        shoppingClothing: 10000,
        gadgetsTravel: 0,
      }, // 20,000 (20%)
      savings: {
        dpsSavings: 15000,
        emergencyFund: 5000,
        loanEmiDebt: 0,
      }, // 20,000 (20%)
    };

    const budget = calculateFamilyBudget(input);
    expect(budget.totalNeeds).toBe(50000);
    expect(budget.needsPercentage).toBe(50);
    expect(budget.totalWants).toBe(20000);
    expect(budget.totalSavings).toBe(20000);
    expect(budget.netSurplusOrDeficit).toBe(10000);
    expect(budget.healthGrade).toBe("optimal");
  });

  it("calculates bank DPS compound maturity with 10% TIN tax and excise duty", () => {
    const dps = calculateDpsFdrMaturity({
      type: "dps",
      amount: 5000,
      annualInterestRate: 8.0,
      tenureYears: 3,
      hasTinCertificate: true,
    });

    expect(dps.totalDeposited).toBe(180000); // 5000 * 36
    expect(dps.grossInterestEarned).toBeGreaterThan(20000);
    expect(dps.taxRatePercent).toBe(10);
    expect(dps.taxDeductedBdt).toBeGreaterThan(0);
    expect(dps.netTakeHomeAmount).toBeGreaterThan(dps.totalDeposited);
  });

  it("calculates authentic Islamic Zakat at 2.5% based on Nisab threshold", () => {
    const goldRate = 130000;
    const silverRate = 2000;
    // Silver Nisab = 52.5 * 2000 = 105,000 BDT
    // Gold Nisab = 7.5 * 130000 = 975,000 BDT

    const zakatEligible = calculateIslamicZakat({
      goldPricePerVori: goldRate,
      silverPricePerVori: silverRate,
      nisabStandard: "silver",
      cashInHandBank: 200000,
      goldOrnamentsVori: 0,
      silverOrnamentsVori: 0,
      businessGoodsInventory: 0,
      loanReceivables: 0,
      investmentsShares: 0,
      immediateDebtsAndLiabilities: 50000, // Net = 150,000 BDT (>= 105,000)
    });

    expect(zakatEligible.silverNisabThresholdBdt).toBe(105000);
    expect(zakatEligible.netZakatableWealthBdt).toBe(150000);
    expect(zakatEligible.isZakatEligible).toBe(true);
    expect(zakatEligible.zakatPayableBdt).toBe(3750); // 150,000 * 0.025

    // Ineligible case (below Nisab)
    const zakatIneligible = calculateIslamicZakat({
      goldPricePerVori: goldRate,
      silverPricePerVori: silverRate,
      nisabStandard: "silver",
      cashInHandBank: 60000,
      goldOrnamentsVori: 0,
      silverOrnamentsVori: 0,
      businessGoodsInventory: 0,
      loanReceivables: 0,
      investmentsShares: 0,
      immediateDebtsAndLiabilities: 20000, // Net = 40,000 BDT (< 105,000)
    });

    expect(zakatIneligible.isZakatEligible).toBe(false);
    expect(zakatIneligible.zakatPayableBdt).toBe(0);
  });
});
