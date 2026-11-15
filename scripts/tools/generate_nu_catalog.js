import fs from 'fs';

const filePath = 'src/lib/education/cgpa-grade-engine.ts';
let code = fs.readFileSync(filePath, 'utf8');

// 1. Update DegreeCategory to include "NU"
code = code.replace(
  'export type DegreeCategory = "BSC" | "BBA" | "BA" | "DIPLOMA";',
  'export type DegreeCategory = "NU" | "BSC" | "BBA" | "BA" | "DIPLOMA";'
);

// 2. Define the comprehensive National University Honours Programs
const nuPrograms = `
  /* =========================================================================
   * NATIONAL UNIVERSITY (NU) HONOURS — RAJSHAHI COLLEGE & AFFILIATED COLLEGES
   * ========================================================================= */

  // 17. NU Political Science (রাষ্ট্রবিজ্ঞান)
  nu_political_science: {
    key: "nu_political_science",
    category: "NU",
    categoryLabelBn: "জাতীয় বিশ্ববিদ্যালয় অনার্স (NU Honours)",
    titleBn: "রাষ্ট্রবিজ্ঞান — বিএসএস (অনার্স) · জাতীয় বিশ্ববিদ্যালয় / রাজশাহী কলেজ",
    titleEn: "B.S.S. (Hons) in Political Science (National University Framework)",
    typicalTotalCredits: 128,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম বর্ষ (পর্ব-১)",
        semesterNameEn: "1st Year (Part 1)",
        courses: [
          { id: "nu-ps-101", code: "211901", name: "Introduction to Political Science / রাষ্ট্রবিজ্ঞানের ভূমিকা ও রাজনৈতিক সংগঠন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ps-102", code: "211903", name: "Political Systems of UK and USA / যুক্তরাজ্য ও যুক্তরাষ্ট্রের রাজনৈতিক ব্যবস্থা", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-ps-103", code: "211905", name: "Political & Constitutional Development in BD (1947 to date) / বাংলাদেশের রাজনৈতিক ও সাংবিধানিক উন্নয়ন", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "১ম বর্ষ (পর্ব-২)",
        semesterNameEn: "1st Year (Part 2)",
        courses: [
          { id: "nu-ps-104", code: "211907", name: "Introduction to Public Administration / লোকপ্রশাসনের ভূমিকা", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-ps-105", code: "211501", name: "History of the Emergence of Independent Bangladesh / স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ps-106", code: "212009", name: "Principles of Sociology / সমাজবিজ্ঞানের মূলনীতি", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "২য় বর্ষ (পর্ব-১)",
        semesterNameEn: "2nd Year (Part 1)",
        courses: [
          { id: "nu-ps-201", code: "221901", name: "Eastern Political Thought / প্রাচ্যের রাষ্ট্রচিন্তা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ps-202", code: "221903", name: "Western Political Thought (Ancient & Medieval) / পাশ্চাত্য রাষ্ট্রচিন্তা: প্রাচীন ও মধ্যযুগ", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-ps-203", code: "221905", name: "Major Issues of Public Administration / লোকপ্রশাসনের মৌলিক প্রত্যয়সমূহ", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "২য় বর্ষ (পর্ব-২)",
        semesterNameEn: "2nd Year (Part 2)",
        courses: [
          { id: "nu-ps-204", code: "221907", name: "Politics and Society in South Asia / দক্ষিণ এশিয়ার রাজনীতি ও সমাজ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ps-205", code: "222009", name: "Sociology of Bangladesh / বাংলাদেশের সমাজবিজ্ঞান", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-ps-206", code: "222209", name: "Bangladesh Economy / বাংলাদেশের অর্থনীতি", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৩য় বর্ষ (পর্ব-১)",
        semesterNameEn: "3rd Year (Part 1)",
        courses: [
          { id: "nu-ps-301", code: "231901", name: "Western Political Thought (Modern) / পাশ্চাত্য রাষ্ট্রচিন্তা: আধুনিক যুগ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ps-302", code: "231903", name: "Political Theories: Concepts and Issues / রাজনৈতিক তত্ত্ব: প্রত্যয় ও সমস্যা", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-ps-303", code: "231905", name: "Comparative Politics / তুলনামূলক রাজনীতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ps-304", code: "231907", name: "Politics & Gov in South Asia: India, Pak, Nepal / দক্ষিণ এশিয়ার রাজনীতি ও সরকার", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৩য় বর্ষ (পর্ব-২)",
        semesterNameEn: "3rd Year (Part 2)",
        courses: [
          { id: "nu-ps-305", code: "231909", name: "Local Government in Bangladesh / বাংলাদেশের স্থানীয় সরকার", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ps-306", code: "231911", name: "International Politics & Foreign Policy / আন্তর্জাতিক রাজনীতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-ps-307", code: "231913", name: "Peace and Conflict Studies / শান্তি ও সংঘাত অধ্যয়ন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ps-308", code: "231915", name: "Public Policy in Bangladesh / বাংলাদেশের জননীতি", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-১)",
        semesterNameEn: "4th Year (Part 1)",
        courses: [
          { id: "nu-ps-401", code: "241901", name: "Bangladesh: Politics, Economy and Society / বাংলাদেশ: রাজনীতি, অর্থনীতি ও সমাজ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ps-402", code: "241903", name: "Modern Political Analysis / আধুনিক রাজনৈতিক বিশ্লেষণ", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-ps-403", code: "241905", name: "Security Studies & Geopolitics / নিরাপত্তা অধ্যয়ন ও ভূরাজনীতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ps-404", code: "241907", name: "Foreign Policy of Bangladesh / বাংলাদেশের পররাষ্ট্রনীতি", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-২)",
        semesterNameEn: "4th Year (Part 2)",
        courses: [
          { id: "nu-ps-405", code: "241909", name: "Political Economy of Bangladesh / বাংলাদেশের রাজনৈতিক অর্থনীতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-ps-406", code: "241911", name: "Environment and Sustainable Development / পরিবেশ ও টেকসই উন্নয়ন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ps-407", code: "241913", name: "Globalization and Regional Cooperation / বিশ্বায়ন ও আঞ্চলিক সহযোগিতা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ps-408", code: "241918", name: "Comprehensive Viva-Voce / মৌখিক পরীক্ষা ও টার্ম পেপার", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // 18. NU Sociology (সমাজবিজ্ঞান)
  nu_sociology: {
    key: "nu_sociology",
    category: "NU",
    categoryLabelBn: "জাতীয় বিশ্ববিদ্যালয় অনার্স (NU Honours)",
    titleBn: "সমাজবিজ্ঞান — বিএসএস (অনার্স) · জাতীয় বিশ্ববিদ্যালয় / রাজশাহী কলেজ",
    titleEn: "B.S.S. (Hons) in Sociology (National University Framework)",
    typicalTotalCredits: 128,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম বর্ষ (পর্ব-১)",
        semesterNameEn: "1st Year (Part 1)",
        courses: [
          { id: "nu-soc-101", code: "212001", name: "Introductory Sociology / সমাজবিজ্ঞান পরিচিতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-soc-102", code: "212003", name: "Social History of Bangladesh / বাংলাদেশের সামাজিক ইতিহাস", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-soc-103", code: "212005", name: "Social Structure of Bangladesh / বাংলাদেশের সমাজ কাঠামো", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "১ম বর্ষ (পর্ব-২)",
        semesterNameEn: "1st Year (Part 2)",
        courses: [
          { id: "nu-soc-104", code: "212007", name: "Introduction to Social Anthropology / সামাজিক নৃবিজ্ঞানের ভূমিকা", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-soc-105", code: "211501", name: "History of Emergence of Independent BD / স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-soc-106", code: "211909", name: "Principles of Political Science / রাষ্ট্রবিজ্ঞানের মূলনীতি", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "২য় বর্ষ (পর্ব-১)",
        semesterNameEn: "2nd Year (Part 1)",
        courses: [
          { id: "nu-soc-201", code: "222001", name: "Classical Sociological Theory / চিরায়ত সমাজতাত্ত্বিক তত্ত্ব", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-soc-202", code: "222003", name: "Social Research Methodology / সামাজিক গবেষণা পদ্ধতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-soc-203", code: "222005", name: "Social Statistics & Demography / সামাজিক পরিসংখ্যান", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "২য় বর্ষ (পর্ব-২)",
        semesterNameEn: "2nd Year (Part 2)",
        courses: [
          { id: "nu-soc-204", code: "222007", name: "Social Problems of Bangladesh / বাংলাদেশের সামাজিক সমস্যা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-soc-205", code: "221909", name: "Government and Politics in BD / বাংলাদেশের সরকার ও রাজনীতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-soc-206", code: "222209", name: "Bangladesh Economy / বাংলাদেশের অর্থনীতি", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৩য় বর্ষ (পর্ব-১)",
        semesterNameEn: "3rd Year (Part 1)",
        courses: [
          { id: "nu-soc-301", code: "232001", name: "Modern Sociological Theory / আধুনিক সমাজতাত্ত্বিক তত্ত্ব", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-soc-302", code: "232003", name: "Rural Sociology & Agrarian Society / গ্রামীণ সমাজবিজ্ঞান", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-soc-303", code: "232005", name: "Urban Sociology & Urbanization / নগর সমাজবিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-soc-304", code: "232007", name: "Sociology of Gender / জেন্ডার সমাজবিজ্ঞান", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৩য় বর্ষ (পর্ব-২)",
        semesterNameEn: "3rd Year (Part 2)",
        courses: [
          { id: "nu-soc-305", code: "232009", name: "Sociology of Religion / ধর্মের সমাজবিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-soc-306", code: "232011", name: "Political Sociology / রাজনৈতিক সমাজবিজ্ঞান", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-soc-307", code: "232013", name: "Sociology of Environment & Climate / পরিবেশের সমাজবিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-soc-308", code: "232015", name: "Crime, Deviance and Society / অপরাধ ও সমাজ", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-১)",
        semesterNameEn: "4th Year (Part 1)",
        courses: [
          { id: "nu-soc-401", code: "242001", name: "Contemporary Sociological Theory / সমকালীন সমাজতাত্ত্বিক তত্ত্ব", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-soc-402", code: "242003", name: "Sociology of Development / উন্নয়ন সমাজবিজ্ঞান", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-soc-403", code: "242005", name: "Population Studies & Family Planning / জনসংখ্যা ও সমাজ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-soc-404", code: "242007", name: "Industrial Sociology & Labor / শিল্প সমাজবিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-২)",
        semesterNameEn: "4th Year (Part 2)",
        courses: [
          { id: "nu-soc-405", code: "242009", name: "Sociology of Health and Illness / স্বাস্থ্য ও চিকিৎসার সমাজবিজ্ঞান", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-soc-406", code: "242011", name: "Social Stratification & Inequality / সামাজিক স্তরবিন্যাস ও বৈষম্য", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-soc-407", code: "242013", name: "Globalization and Social Change / বিশ্বায়ন ও সামাজিক পরিবর্তন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-soc-408", code: "242018", name: "Comprehensive Viva-Voce / মৌখিক পরীক্ষা ও ফিল্ড রিপোর্ট", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // 19. NU Accounting (হিসাববিজ্ঞান)
  nu_accounting: {
    key: "nu_accounting",
    category: "NU",
    categoryLabelBn: "জাতীয় বিশ্ববিদ্যালয় অনার্স (NU Honours)",
    titleBn: "হিসাববিজ্ঞান — বিবিএ (অনার্স) · জাতীয় বিশ্ববিদ্যালয় / রাজশাহী কলেজ",
    titleEn: "B.B.A. (Hons) in Accounting (National University Framework)",
    typicalTotalCredits: 128,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম বর্ষ (পর্ব-১)",
        semesterNameEn: "1st Year (Part 1)",
        courses: [
          { id: "nu-acc-101", code: "212501", name: "Principles of Accounting / হিসাববিজ্ঞানের মূলনীতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-acc-102", code: "212503", name: "Principles of Management / ব্যবস্থাপনার মূলনীতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-acc-103", code: "212505", name: "Principles of Marketing / বাজারজাতকরণের মূলনীতি", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "১ম বর্ষ (পর্ব-২)",
        semesterNameEn: "1st Year (Part 2)",
        courses: [
          { id: "nu-acc-104", code: "212507", name: "Principles of Finance / অর্থায়নের মূলনীতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-acc-105", code: "211501", name: "History of Emergence of Independent BD / স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-acc-106", code: "212509", name: "Business Mathematics / ব্যবসায় গণিত", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "২য় বর্ষ (পর্ব-১)",
        semesterNameEn: "2nd Year (Part 1)",
        courses: [
          { id: "nu-acc-201", code: "222501", name: "Intermediate Accounting / উচ্চতর আর্থিক হিসাববিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-acc-202", code: "222503", name: "Cost Accounting / ব্যয় হিসাববিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-acc-203", code: "222505", name: "Business Statistics / ব্যবসায় পরিসংখ্যান", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "২য় বর্ষ (পর্ব-২)",
        semesterNameEn: "2nd Year (Part 2)",
        courses: [
          { id: "nu-acc-204", code: "222507", name: "Business Communication & Report Writing / ব্যবসায় যোগাযোগ ও রিপোর্ট লিখন", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-acc-205", code: "222509", name: "Macroeconomics for Business / ব্যবসায় সামষ্টিক অর্থনীতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-acc-206", code: "222511", name: "Computer & IT in Accounting / হিসাববিজ্ঞানে তথ্যপ্রযুক্তি", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৩য় বর্ষ (পর্ব-১)",
        semesterNameEn: "3rd Year (Part 1)",
        courses: [
          { id: "nu-acc-301", code: "232501", name: "Advanced Accounting-I / উন্নত হিসাববিজ্ঞান-১", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-acc-302", code: "232503", name: "Cost Management & Cost Audit / ব্যয় ব্যবস্থাপনা ও ব্যয় নিরীক্ষা", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-acc-303", code: "232505", name: "Taxation in Bangladesh / বাংলাদেশের করবিধি ও প্রয়োগ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-acc-304", code: "232507", name: "Auditing & Assurance Standards / নিরীক্ষা ও পেশাগত মান", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৩য় বর্ষ (পর্ব-২)",
        semesterNameEn: "3rd Year (Part 2)",
        courses: [
          { id: "nu-acc-305", code: "232509", name: "Financial Management / আর্থিক ব্যবস্থাপনা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-acc-306", code: "232511", name: "Management Accounting / ব্যবস্থাপনা হিসাববিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-acc-307", code: "232513", name: "Business and Commercial Law / ব্যবসায় ও বাণিজ্য আইন", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-acc-308", code: "232515", name: "Banking and Insurance Law / ব্যাংকিং ও বিমা আইন", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-১)",
        semesterNameEn: "4th Year (Part 1)",
        courses: [
          { id: "nu-acc-401", code: "242501", name: "Advanced Accounting-II / উন্নত হিসাববিজ্ঞান-২", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-acc-402", code: "242503", name: "Accounting Theory & IFRS Standards / হিসাববিজ্ঞান তত্ত্ব ও আন্তর্জাতিক মান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-acc-403", code: "242505", name: "Advanced Financial Management / উচ্চতর আর্থিক ব্যবস্থাপনা", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-acc-404", code: "242507", name: "Corporate Governance & Ethics / করপোরেট সুশাসন ও পেশাগত নীতি", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-২)",
        semesterNameEn: "4th Year (Part 2)",
        courses: [
          { id: "nu-acc-405", code: "242509", name: "Accounting Information Systems (AIS) / হিসাববিজ্ঞান তথ্য ব্যবস্থা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-acc-406", code: "242511", name: "Strategic Management Accounting / কৌশলগত ব্যবস্থাপনা হিসাববিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-acc-407", code: "242515", name: "Research Methodology in Business / ব্যবসায় গবেষণা পদ্ধতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-acc-408", code: "242518", name: "Comprehensive Viva-Voce / মৌখিক পরীক্ষা ও ইন্টার্নশিপ", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // 20. NU Management (ব্যবস্থাপনা)
  nu_management: {
    key: "nu_management",
    category: "NU",
    categoryLabelBn: "জাতীয় বিশ্ববিদ্যালয় অনার্স (NU Honours)",
    titleBn: "ব্যবস্থাপনা — বিবিএ (অনার্স) · জাতীয় বিশ্ববিদ্যালয় / রাজশাহী কলেজ",
    titleEn: "B.B.A. (Hons) in Management (National University Framework)",
    typicalTotalCredits: 128,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম বর্ষ (পর্ব-১)",
        semesterNameEn: "1st Year (Part 1)",
        courses: [
          { id: "nu-mgt-101", code: "212601", name: "Introduction to Business / ব্যবসায় পরিচিতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mgt-102", code: "212603", name: "Principles of Management / ব্যবস্থাপনার মূলনীতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mgt-103", code: "212605", name: "Principles of Accounting / হিসাববিজ্ঞানের মূলনীতি", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "১ম বর্ষ (পর্ব-২)",
        semesterNameEn: "1st Year (Part 2)",
        courses: [
          { id: "nu-mgt-104", code: "212607", name: "Principles of Marketing / বাজারজাতকরণের মূলনীতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-mgt-105", code: "211501", name: "History of Emergence of Independent BD / স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mgt-106", code: "212609", name: "Business Mathematics / ব্যবসায় গণিত", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "২য় বর্ষ (পর্ব-১)",
        semesterNameEn: "2nd Year (Part 1)",
        courses: [
          { id: "nu-mgt-201", code: "222601", name: "Human Resource Management (HRM) / মানবসম্পদ ব্যবস্থাপনা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mgt-202", code: "222603", name: "Business Communication / ব্যবসায় যোগাযোগ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mgt-203", code: "222605", name: "Legal Environment of Business / ব্যবসায়ের আইনগত পরিবেশ", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "২য় বর্ষ (পর্ব-২)",
        semesterNameEn: "2nd Year (Part 2)",
        courses: [
          { id: "nu-mgt-204", code: "222607", name: "Business Statistics / ব্যবসায় পরিসংখ্যান", credits: 4.0, gradePoint: 3.5 },
          { id: "nu-mgt-205", code: "222609", name: "Principles of Finance / অর্থায়নের মূলনীতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-mgt-206", code: "222611", name: "Taxation in Bangladesh / বাংলাদেশের করবিধি", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৩য় বর্ষ (পর্ব-১)",
        semesterNameEn: "3rd Year (Part 1)",
        courses: [
          { id: "nu-mgt-301", code: "232601", name: "Organizational Behavior (OB) / সাংগঠনিক আচরণ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mgt-302", code: "232603", name: "Operations Management / উৎপাদন ও পরিচালনা ব্যবস্থাপনা", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-mgt-303", code: "232605", name: "Financial Management / আর্থিক ব্যবস্থাপনা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mgt-304", code: "232607", name: "Marketing Management / মার্কেটিং ব্যবস্থাপনা", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৩য় বর্ষ (পর্ব-২)",
        semesterNameEn: "3rd Year (Part 2)",
        courses: [
          { id: "nu-mgt-305", code: "232609", name: "Management Accounting / ব্যবস্থাপনা হিসাববিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mgt-306", code: "232611", name: "Company Law & Secretarial Practice / কোম্পানি আইন ও সাচিবিক চর্চা", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-mgt-307", code: "232613", name: "Insurance and Risk Management / বিমা ও ঝুঁকি ব্যবস্থাপনা", credits: 4.0, gradePoint: 3.5 },
          { id: "nu-mgt-308", code: "232615", name: "Computer Applications in Business / ব্যবসায়ে কম্পিউটার অ্যাপ্লিকেশন", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-১)",
        semesterNameEn: "4th Year (Part 1)",
        courses: [
          { id: "nu-mgt-401", code: "242601", name: "Strategic Management / কৌশলগত ব্যবস্থাপনা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mgt-402", code: "242603", name: "Supply Chain Management (SCM) / সরবরাহ শৃঙ্খল ব্যবস্থাপনা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mgt-403", code: "242605", name: "Total Quality Management (TQM) / সার্বিক গুণগত মান ব্যবস্থাপনা", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-mgt-404", code: "242607", name: "Project Management / প্রকল্প ব্যবস্থাপনা", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-২)",
        semesterNameEn: "4th Year (Part 2)",
        courses: [
          { id: "nu-mgt-405", code: "242609", name: "Entrepreneurship Development / উদ্যোক্তা উন্নয়ন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mgt-406", code: "242611", name: "International Business / আন্তর্জাতিক বাণিজ্য", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-mgt-407", code: "242613", name: "Industrial Relations & Labor Law / শিল্প সম্পর্ক ও শ্রম আইন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mgt-408", code: "242618", name: "Comprehensive Viva-Voce / মৌখিক পরীক্ষা ও ইন্টার্নশিপ", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // 21. NU Physics (পদার্থবিজ্ঞান)
  nu_physics: {
    key: "nu_physics",
    category: "NU",
    categoryLabelBn: "জাতীয় বিশ্ববিদ্যালয় অনার্স (NU Honours)",
    titleBn: "পদার্থবিজ্ঞান — বিএসসি (অনার্স) · জাতীয় বিশ্ববিদ্যালয় / রাজশাহী কলেজ",
    titleEn: "B.Sc. (Hons) in Physics (National University Framework)",
    typicalTotalCredits: 130,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম বর্ষ (পর্ব-১)",
        semesterNameEn: "1st Year (Part 1)",
        courses: [
          { id: "nu-phy-101", code: "212701", name: "Mechanics / বলবিদ্যা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phy-102", code: "212703", name: "Properties of Matter, Waves & Oscillations / পদার্থের ধর্ম, তরঙ্গ ও স্পন্দন", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-phy-103", code: "212705", name: "Thermal Physics & Thermodynamics / তাপ ও তাপগতিবিদ্যা", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "১ম বর্ষ (পর্ব-২)",
        semesterNameEn: "1st Year (Part 2)",
        courses: [
          { id: "nu-phy-104", code: "212706", name: "Physics Practical-I / পদার্থবিজ্ঞান ব্যবহারিক-১", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phy-105", code: "211501", name: "History of Emergence of Independent BD / স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phy-106", code: "213709", name: "Calculus & Linear Algebra / ক্যালকুলাস ও বীজগণিত", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "২য় বর্ষ (পর্ব-১)",
        semesterNameEn: "2nd Year (Part 1)",
        courses: [
          { id: "nu-phy-201", code: "222701", name: "Electricity and Magnetism / তড়িৎ ও চুম্বকত্ব", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phy-202", code: "222703", name: "Geometrical & Physical Optics / জ্যামিতিক ও ভৌত আলোকবিজ্ঞান", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-phy-203", code: "222705", name: "Classical Mechanics & Relativity / চিরায়ত বলবিদ্যা ও আপেক্ষিকতা", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "২য় বর্ষ (পর্ব-২)",
        semesterNameEn: "2nd Year (Part 2)",
        courses: [
          { id: "nu-phy-204", code: "222706", name: "Physics Practical-II / পদার্থবিজ্ঞান ব্যবহারিক-২", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phy-205", code: "223707", name: "Mathematical Physics-I / গাণিতিক পদার্থবিজ্ঞান-১", credits: 4.0, gradePoint: 3.5 },
          { id: "nu-phy-206", code: "222807", name: "Physical Chemistry / ভৌত রসায়ন", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৩য় বর্ষ (পর্ব-১)",
        semesterNameEn: "3rd Year (Part 1)",
        courses: [
          { id: "nu-phy-301", code: "232701", name: "Atomic and Molecular Physics / পরমাণু ও আণবিক পদার্থবিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phy-302", code: "232703", name: "Quantum Mechanics-I / কোয়ান্টাম বলবিদ্যা-১", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phy-303", code: "232705", name: "Nuclear Physics-I / নিউক্লীয় পদার্থবিজ্ঞান-১", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-phy-304", code: "232707", name: "Solid State Physics-I / কঠিন অবস্থার পদার্থবিজ্ঞান-১", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৩য় বর্ষ (পর্ব-২)",
        semesterNameEn: "3rd Year (Part 2)",
        courses: [
          { id: "nu-phy-305", code: "232709", name: "Basic Electronics & Circuit Design / মৌলিক ইলেকট্রনিক্স", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phy-306", code: "232711", name: "Classical Electrodynamics / তড়িৎগতিবিদ্যা", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-phy-307", code: "232713", name: "Statistical Mechanics / পরিসংখ্যানিক বলবিদ্যা", credits: 4.0, gradePoint: 3.5 },
          { id: "nu-phy-308", code: "232714", name: "Physics Practical-III / পদার্থবিজ্ঞান ব্যবহারিক-৩", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-১)",
        semesterNameEn: "4th Year (Part 1)",
        courses: [
          { id: "nu-phy-401", code: "242701", name: "Advanced Quantum Mechanics-II / উচ্চতর কোয়ান্টাম বলবিদ্যা-২", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phy-402", code: "242703", name: "Nuclear Physics-II & Particles / উচ্চতর নিউক্লীয় ও কণা পদার্থবিজ্ঞান", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-phy-403", code: "242705", name: "Solid State Physics-II & Nano / কঠিন অবস্থা পদার্থবিজ্ঞান-২ ও ন্যানোটেক", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phy-404", code: "242707", name: "Digital Electronics & Microprocessors / ডিজিটাল ইলেকট্রনিক্স", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-২)",
        semesterNameEn: "4th Year (Part 2)",
        courses: [
          { id: "nu-phy-405", code: "242709", name: "Computational Physics & Python / কম্পিউটেশনাল ফিজিক্স", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phy-406", code: "242711", name: "Renewable Energy & Solar Cells / নবায়নযোগ্য শক্তি ও সৌরকোষ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phy-407", code: "242714", name: "Advanced Physics Practical-IV / উচ্চতর পদার্থবিজ্ঞান ব্যবহারিক-৪", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phy-408", code: "242718", name: "Comprehensive Viva-Voce / মৌখিক পরীক্ষা ও থিসিস", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // 22. NU Chemistry (রসায়ন)
  nu_chemistry: {
    key: "nu_chemistry",
    category: "NU",
    categoryLabelBn: "জাতীয় বিশ্ববিদ্যালয় অনার্স (NU Honours)",
    titleBn: "রসায়ন — বিএসসি (অনার্স) · জাতীয় বিশ্ববিদ্যালয় / রাজশাহী কলেজ",
    titleEn: "B.Sc. (Hons) in Chemistry (National University Framework)",
    typicalTotalCredits: 130,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম বর্ষ (পর্ব-১)",
        semesterNameEn: "1st Year (Part 1)",
        courses: [
          { id: "nu-ch-101", code: "212801", name: "Physical Chemistry-I / ভৌত রসায়ন-১", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ch-102", code: "212803", name: "Organic Chemistry-I / জৈব রসায়ন-১", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ch-103", code: "212805", name: "Fundamentals of Inorganic Chemistry / অজৈব রসায়নের মূলভিত্তি", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "১ম বর্ষ (পর্ব-২)",
        semesterNameEn: "1st Year (Part 2)",
        courses: [
          { id: "nu-ch-104", code: "212806", name: "Chemistry Practical-I / রসায়ন ব্যবহারিক-১", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ch-105", code: "211501", name: "History of Emergence of Independent BD / স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ch-106", code: "212709", name: "Physics-I for Chemistry / পদার্থবিজ্ঞান-১", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "২য় বর্ষ (পর্ব-১)",
        semesterNameEn: "2nd Year (Part 1)",
        courses: [
          { id: "nu-ch-201", code: "222801", name: "Physical Chemistry-II / ভৌত রসায়ন-২", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ch-202", code: "222803", name: "Organic Chemistry-II / জৈব রসায়ন-২", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ch-203", code: "222805", name: "Inorganic Chemistry-II / অজৈব রসায়ন-২", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "২য় বর্ষ (পর্ব-২)",
        semesterNameEn: "2nd Year (Part 2)",
        courses: [
          { id: "nu-ch-204", code: "222806", name: "Chemistry Practical-II / রসায়ন ব্যবহারিক-২", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ch-205", code: "222709", name: "Physics-II for Chemistry / পদার্থবিজ্ঞান-২", credits: 4.0, gradePoint: 3.5 },
          { id: "nu-ch-206", code: "223707", name: "Mathematics-II / গণিত-২", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৩য় বর্ষ (পর্ব-১)",
        semesterNameEn: "3rd Year (Part 1)",
        courses: [
          { id: "nu-ch-301", code: "232801", name: "Physical Chemistry-III / ভৌত রসায়ন-৩ (তাপগতিবিদ্যা)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ch-302", code: "232803", name: "Organic Chemistry-III / জৈব রসায়ন-৩ (স্টেরিওরসায়ন)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ch-303", code: "232805", name: "Inorganic Chemistry-III / অজৈব রসায়ন-৩ (জটিল যৌগ)", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-ch-304", code: "232807", name: "Analytical Chemistry & Spectroscopy / বিশ্লেষণীয় রসায়ন", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৩য় বর্ষ (পর্ব-২)",
        semesterNameEn: "3rd Year (Part 2)",
        courses: [
          { id: "nu-ch-305", code: "232809", name: "Environmental Chemistry / পরিবেশ রসায়ন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ch-306", code: "232811", name: "Industrial & Petrochemical Chemistry / শিল্প রসায়ন", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-ch-307", code: "232813", name: "Quantum Chemistry / কোয়ান্টাম রসায়ন", credits: 4.0, gradePoint: 3.5 },
          { id: "nu-ch-308", code: "232814", name: "Chemistry Practical-III / রসায়ন ব্যবহারিক-৩", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-১)",
        semesterNameEn: "4th Year (Part 1)",
        courses: [
          { id: "nu-ch-401", code: "242801", name: "Physical Chemistry-IV / উচ্চতর ভৌত রসায়ন-৪", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ch-402", code: "242803", name: "Organic Synthesis & Heterocyclic / হেটারোসাইক্লিক জৈব রসায়ন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ch-403", code: "242805", name: "Bioinorganic Chemistry / জীবঅজৈব রসায়ন", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-ch-404", code: "242807", name: "Nuclear and Radiochemistry / নিউক্লীয় ও তেজস্ক্রিয় রসায়ন", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-২)",
        semesterNameEn: "4th Year (Part 2)",
        courses: [
          { id: "nu-ch-405", code: "242809", name: "Medicinal & Pharmaceutical Chemistry / ঔষধ ও ফার্মাসিউটিক্যাল রসায়ন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ch-406", code: "242811", name: "Polymer Chemistry & Plastics / পলিমার রসায়ন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ch-407", code: "242814", name: "Advanced Chemistry Practical-IV / উচ্চতর ব্যবহারিক-৪", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ch-408", code: "242818", name: "Comprehensive Viva-Voce / মৌখিক পরীক্ষা ও গবেষণা সন্দর্ভ", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // 23. NU Mathematics (গণিত)
  nu_mathematics: {
    key: "nu_mathematics",
    category: "NU",
    categoryLabelBn: "জাতীয় বিশ্ববিদ্যালয় অনার্স (NU Honours)",
    titleBn: "গণিত — বিএসসি (অনার্স) · জাতীয় বিশ্ববিদ্যালয় / রাজশাহী কলেজ",
    titleEn: "B.Sc. (Hons) in Mathematics (National University Framework)",
    typicalTotalCredits: 128,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম বর্ষ (পর্ব-১)",
        semesterNameEn: "1st Year (Part 1)",
        courses: [
          { id: "nu-mat-101", code: "213701", name: "Fundamentals of Mathematics / গণিতের প্রাথমিক ভিত্তি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mat-102", code: "213703", name: "Calculus-I / ক্যালকুলাস-১", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mat-103", code: "213705", name: "Linear Algebra / লিনিয়ার অ্যালজেব্রা", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "১ম বর্ষ (পর্ব-২)",
        semesterNameEn: "1st Year (Part 2)",
        courses: [
          { id: "nu-mat-104", code: "213707", name: "Analytic & Vector Geometry / বিশ্লেষণী ও ভেক্টর জ্যামিতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mat-105", code: "213708", name: "Math Lab-I (Fortran / Python) / গণিত ল্যাব-১", credits: 2.0, gradePoint: 4.0 },
          { id: "nu-mat-106", code: "211501", name: "History of Emergence of Independent BD / স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mat-107", code: "212709", name: "Physics-I for Math / পদার্থবিজ্ঞান-১", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "২য় বর্ষ (পর্ব-১)",
        semesterNameEn: "2nd Year (Part 1)",
        courses: [
          { id: "nu-mat-201", code: "223701", name: "Calculus-II / ক্যালকুলাস-২", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mat-202", code: "223703", name: "Ordinary Differential Equations / সাধারণ অন্তরক সমীকরণ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mat-203", code: "223705", name: "Real Analysis-I / বাস্তব বিশ্লেষণ-১", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "২য় বর্ষ (পর্ব-২)",
        semesterNameEn: "2nd Year (Part 2)",
        courses: [
          { id: "nu-mat-204", code: "223706", name: "Math Lab-II / গণিত ল্যাব-২", credits: 2.0, gradePoint: 4.0 },
          { id: "nu-mat-205", code: "222709", name: "Physics-II for Math / পদার্থবিজ্ঞান-২", credits: 4.0, gradePoint: 3.5 },
          { id: "nu-mat-206", code: "223609", name: "Probability & Statistics / পরিসংখ্যান", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৩য় বর্ষ (পর্ব-১)",
        semesterNameEn: "3rd Year (Part 1)",
        courses: [
          { id: "nu-mat-301", code: "233701", name: "Abstract Algebra / বিমূর্ত বীজগণিত", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mat-302", code: "233703", name: "Real Analysis & Metric Spaces / বাস্তব বিশ্লেষণ ও মেট্রিক স্পেস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mat-303", code: "233705", name: "Numerical Analysis / সাংখ্যিক বিশ্লেষণ", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-mat-304", code: "233707", name: "Complex Analysis / জটিল চলকের বিশ্লেষণ", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৩য় বর্ষ (পর্ব-২)",
        semesterNameEn: "3rd Year (Part 2)",
        courses: [
          { id: "nu-mat-305", code: "233709", name: "Classical Mechanics / চিরায়ত বলবিদ্যা", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-mat-306", code: "233711", name: "Linear Programming / রৈখিক প্রোগ্রামিং", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mat-307", code: "233713", name: "Differential Geometry / অন্তরক জ্যামিতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-mat-308", code: "233714", name: "Math Lab-III (MATLAB/Python) / গণিত ল্যাব-৩", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-১)",
        semesterNameEn: "4th Year (Part 1)",
        courses: [
          { id: "nu-mat-401", code: "243701", name: "Theory of Numbers / সংখ্যাতত্ত্ব", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mat-402", code: "243703", name: "Topology & Functional Analysis / টপোলজি ও ফাংশনাল অ্যানালাইসিস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mat-403", code: "243705", name: "Partial Differential Equations / আংশিক অন্তরক সমীকরণ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mat-404", code: "243707", name: "Fluid Dynamics / প্রবাহী গতিবিদ্যা", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-২)",
        semesterNameEn: "4th Year (Part 2)",
        courses: [
          { id: "nu-mat-405", code: "243709", name: "Operations Research / অপারেশন্স রিসার্চ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mat-406", code: "243711", name: "Tensor Analysis & Relativity / টেনসর বিশ্লেষণ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mat-407", code: "243713", name: "Mathematical Modeling / গাণিতিক মডেলিং", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mat-408", code: "243718", name: "Comprehensive Viva-Voce / মৌখিক পরীক্ষা", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // 24. NU Botany (উদ্ভিদবিজ্ঞান)
  nu_botany: {
    key: "nu_botany",
    category: "NU",
    categoryLabelBn: "জাতীয় বিশ্ববিদ্যালয় অনার্স (NU Honours)",
    titleBn: "উদ্ভিদবিজ্ঞান — বিএসসি (অনার্স) · জাতীয় বিশ্ববিদ্যালয় / রাজশাহী কলেজ",
    titleEn: "B.Sc. (Hons) in Botany (National University Framework)",
    typicalTotalCredits: 128,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম বর্ষ (পর্ব-১)",
        semesterNameEn: "1st Year (Part 1)",
        courses: [
          { id: "nu-bot-101", code: "213001", name: "Microbiology / অণুজীববিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-102", code: "213003", name: "Phycology / শৈবালবিজ্ঞান", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-bot-103", code: "213005", name: "Mycology / ছত্রাকবিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "১ম বর্ষ (পর্ব-২)",
        semesterNameEn: "1st Year (Part 2)",
        courses: [
          { id: "nu-bot-104", code: "213006", name: "Botany Practical-I / উদ্ভিদবিজ্ঞান ব্যবহারিক-১", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-105", code: "211501", name: "History of Emergence of Independent BD / স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-106", code: "213109", name: "Zoology-I for Botany / প্রাণিবিজ্ঞান-১", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "২য় বর্ষ (পর্ব-১)",
        semesterNameEn: "2nd Year (Part 1)",
        courses: [
          { id: "nu-bot-201", code: "223001", name: "Pteridophyta & Gymnosperms / ফার্ন ও নগ্নবীজী উদ্ভিদ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-202", code: "223003", name: "Plant Pathology / উদ্ভিদ রোগতত্ত্ব", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-bot-203", code: "223005", name: "Plant Anatomy & Embryology / উদ্ভিদ অঙ্গসংস্থান ও ভ্রূণতত্ত্ব", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "২য় বর্ষ (পর্ব-২)",
        semesterNameEn: "2nd Year (Part 2)",
        courses: [
          { id: "nu-bot-204", code: "223006", name: "Botany Practical-II / উদ্ভিদবিজ্ঞান ব্যবহারিক-২", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-205", code: "223109", name: "Zoology-II for Botany / প্রাণিবিজ্ঞান-২", credits: 4.0, gradePoint: 3.5 },
          { id: "nu-bot-206", code: "222807", name: "Chemistry for Botany / রসায়ন", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৩য় বর্ষ (পর্ব-১)",
        semesterNameEn: "3rd Year (Part 1)",
        courses: [
          { id: "nu-bot-301", code: "233001", name: "Taxonomy of Angiosperms / আবৃতবীজী উদ্ভিদের শ্রেণীবিন্যাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-302", code: "233003", name: "Plant Physiology / উদ্ভিদ শারীরতত্ত্ব", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-303", code: "233005", name: "Plant Biochemistry / উদ্ভিদ প্রাণরসায়ন", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-bot-304", code: "233007", name: "Ecology & Environmental Biology / বাস্তুসংস্থান ও পরিবেশ", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৩য় বর্ষ (পর্ব-২)",
        semesterNameEn: "3rd Year (Part 2)",
        courses: [
          { id: "nu-bot-305", code: "233009", name: "Cytology & Cytogenetics / কোষবিদ্যা ও সাইটোজেনেটিক্স", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-306", code: "233011", name: "Genetics & Plant Breeding / বংশগতিবিদ্যা ও উদ্ভিদ প্রজনন", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-bot-307", code: "233013", name: "Economic Botany & Ethnobotany / অর্থনৈতিক উদ্ভিদবিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-308", code: "233014", name: "Botany Practical-III / উদ্ভিদবিজ্ঞান ব্যবহারিক-৩", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-১)",
        semesterNameEn: "4th Year (Part 1)",
        courses: [
          { id: "nu-bot-401", code: "243001", name: "Molecular Biology & Biotechnology / আণবিক জীববিজ্ঞান ও বায়োটেকনোলজি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-402", code: "243003", name: "Bioinformatics & Biostatistics / বায়োইনফরমেটিক্স ও বায়োস্ট্যাটিস্টিক্স", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-bot-403", code: "243005", name: "Agronomy and Horticulture / কৃষিতত্ত্ব ও উদ্যানতত্ত্ব", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-404", code: "243007", name: "Biodiversity & Conservation / জীববৈচিত্র্য ও সংরক্ষণ", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-২)",
        semesterNameEn: "4th Year (Part 2)",
        courses: [
          { id: "nu-bot-405", code: "243009", name: "Forestry and Plant Resources / বনবিজ্ঞান ও উদ্ভিদ সম্পদ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-406", code: "243011", name: "Pharmacognosy & Herbal Medicine / ভেষজ উদ্ভিদ ও ওষুধতত্ত্ব", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-407", code: "243014", name: "Advanced Botany Practical-IV / উচ্চতর ব্যবহারিক-৪", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-408", code: "243018", name: "Comprehensive Viva-Voce / মৌখিক পরীক্ষা ও ফিল্ড ট্যুর", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // 25. NU Zoology (প্রাণিবিজ্ঞান)
  nu_zoology: {
    key: "nu_zoology",
    category: "NU",
    categoryLabelBn: "জাতীয় বিশ্ববিদ্যালয় অনার্স (NU Honours)",
    titleBn: "প্রাণিবিজ্ঞান — বিএসসি (অনার্স) · জাতীয় বিশ্ববিদ্যালয় / রাজশাহী কলেজ",
    titleEn: "B.Sc. (Hons) in Zoology (National University Framework)",
    typicalTotalCredits: 128,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম বর্ষ (পর্ব-১)",
        semesterNameEn: "1st Year (Part 1)",
        courses: [
          { id: "nu-zoo-101", code: "213101", name: "Introduction to Zoology & Non-Chordata / প্রাণী পরিচিতি ও অকর্ডাটা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-zoo-102", code: "213103", name: "Animal Diversity & Evolution / প্রাণীবৈচিত্র্য ও বিবর্তন", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-zoo-103", code: "213105", name: "Cell Biology & Genetics Basics / কোষবিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "১ম বর্ষ (পর্ব-২)",
        semesterNameEn: "1st Year (Part 2)",
        courses: [
          { id: "nu-zoo-104", code: "213106", name: "Zoology Practical-I / প্রাণিবিজ্ঞান ব্যবহারিক-১", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-zoo-105", code: "211501", name: "History of Emergence of Independent BD / স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-zoo-106", code: "213009", name: "Botany-I for Zoology / উদ্ভিদবিজ্ঞান-১", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "২য় বর্ষ (পর্ব-১)",
        semesterNameEn: "2nd Year (Part 1)",
        courses: [
          { id: "nu-zoo-201", code: "223101", name: "Chordata / কর্ডাটা পর্বের প্রাণিবিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-zoo-202", code: "223103", name: "Comparative Anatomy of Vertebrates / মেরুদণ্ডী প্রাণীদের তুলনামূলক অঙ্গসংস্থান", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-zoo-203", code: "223105", name: "Developmental Biology & Embryology / প্রাণীর ভ্রূণতত্ত্ব", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "২য় বর্ষ (পর্ব-২)",
        semesterNameEn: "2nd Year (Part 2)",
        courses: [
          { id: "nu-zoo-204", code: "223106", name: "Zoology Practical-II / প্রাণিবিজ্ঞান ব্যবহারিক-২", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-zoo-205", code: "223009", name: "Botany-II for Zoology / উদ্ভিদবিজ্ঞান-২", credits: 4.0, gradePoint: 3.5 },
          { id: "nu-zoo-206", code: "222807", name: "Chemistry for Zoology / রসায়ন", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৩য় বর্ষ (পর্ব-১)",
        semesterNameEn: "3rd Year (Part 1)",
        courses: [
          { id: "nu-zoo-301", code: "233101", name: "Animal Ecology & Wildlife / বাস্তুসংস্থান ও বন্যপ্রাণী বিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-zoo-302", code: "233103", name: "Genetics and Molecular Biology / বংশগতিবিদ্যা ও আণবিক জীববিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-zoo-303", code: "233105", name: "Animal Physiology & Endocrinology / প্রাণী শারীরতত্ত্ব", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-zoo-304", code: "233107", name: "Biochemistry & Immunology / প্রাণরসায়ন ও অনাক্রম্যতত্ত্ব", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৩য় বর্ষ (পর্ব-২)",
        semesterNameEn: "3rd Year (Part 2)",
        courses: [
          { id: "nu-zoo-305", code: "233109", name: "Parasitology / পরজীবীবিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-zoo-306", code: "233111", name: "Entomology / কীটতত্ত্ব", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-zoo-307", code: "233113", name: "Fisheries Biology / মৎস্য জীববিজ্ঞান", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-zoo-308", code: "233114", name: "Zoology Practical-III / প্রাণিবিজ্ঞান ব্যবহারিক-৩", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-১)",
        semesterNameEn: "4th Year (Part 1)",
        courses: [
          { id: "nu-zoo-401", code: "243101", name: "Applied Entomology & Pest Control / ফলিত কীটতত্ত্ব ও বালাই দমন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-zoo-402", code: "243103", name: "Fisheries Management & Aquaculture / মৎস্য চাষ ও ব্যবস্থাপনা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-zoo-403", code: "243105", name: "Medical & Veterinary Parasitology / চিকিৎসা ও পশু পরজীবীবিজ্ঞান", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-zoo-404", code: "243107", name: "Wildlife Conservation & Management / বন্যপ্রাণী সংরক্ষণ ও ব্যবস্থাপনা", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-২)",
        semesterNameEn: "4th Year (Part 2)",
        courses: [
          { id: "nu-zoo-405", code: "243109", name: "Biostatistics & Research Methodology / জৈবপরিসংখ্যান ও গবেষণা পদ্ধতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-zoo-406", code: "243111", name: "Animal Behavior & Sociobiology / প্রাণীর আচরণ ও সমাজজীববিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-zoo-407", code: "243114", name: "Advanced Zoology Practical-IV / উচ্চতর ব্যবহারিক-৪", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-zoo-408", code: "243118", name: "Comprehensive Viva-Voce / মৌখিক পরীক্ষা ও ফিল্ড এক্সকারশন", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // 26. NU History (ইতিহাস)
  nu_history: {
    key: "nu_history",
    category: "NU",
    categoryLabelBn: "জাতীয় বিশ্ববিদ্যালয় অনার্স (NU Honours)",
    titleBn: "ইতিহাস — বিএ (অনার্স) · জাতীয় বিশ্ববিদ্যালয় / রাজশাহী কলেজ",
    titleEn: "B.A. (Hons) in History (National University Framework)",
    typicalTotalCredits: 124,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম বর্ষ (পর্ব-১)",
        semesterNameEn: "1st Year (Part 1)",
        courses: [
          { id: "nu-his-101", code: "211501", name: "History of Emergence of Independent BD / স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-his-102", code: "211503", name: "History of Ancient Bengal (Up to 1204) / প্রাচীন বাংলার ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-his-103", code: "211505", name: "History of Ancient India / প্রাচীন ভারতের ইতিহাস", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "১ম বর্ষ (পর্ব-২)",
        semesterNameEn: "1st Year (Part 2)",
        courses: [
          { id: "nu-his-104", code: "211507", name: "History of Ancient Civilizations / প্রাচীন সভ্যতার ইতিহাস (মিশর, গ্রীস, রোম)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-his-105", code: "211909", name: "Political Science Principles / রাষ্ট্রবিজ্ঞানের মূলনীতি", credits: 4.0, gradePoint: 3.5 },
          { id: "nu-his-106", code: "212009", name: "Principles of Sociology / সমাজবিজ্ঞানের মূলনীতি", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "২য় বর্ষ (পর্ব-১)",
        semesterNameEn: "2nd Year (Part 1)",
        courses: [
          { id: "nu-his-201", code: "221501", name: "History of Medieval Bengal (1204-1757) / মধ্যযুগের বাংলার ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-his-202", code: "221503", name: "History of Medieval India: Sultanate & Mughal / মধ্যযুগের ভারত: সুলতানি ও মুঘল", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-his-203", code: "221505", name: "History of Europe (1453-1789) / ইউরোপের ইতিহাস: রেনেসাঁ ও বিপ্লব", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "২য় বর্ষ (পর্ব-২)",
        semesterNameEn: "2nd Year (Part 2)",
        courses: [
          { id: "nu-his-204", code: "221507", name: "History of England under Tudors & Stuarts / ইংল্যান্ডের ইতিহাস", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-his-205", code: "221909", name: "Govt & Politics in Bangladesh / বাংলাদেশের সরকার ও রাজনীতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-his-206", code: "222009", name: "Sociology of Bangladesh / বাংলাদেশের সমাজবিজ্ঞান", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৩য় বর্ষ (পর্ব-১)",
        semesterNameEn: "3rd Year (Part 1)",
        courses: [
          { id: "nu-his-301", code: "231501", name: "History of Modern Bengal (1757-1947) / আধুনিক বাংলার ইতিহাস (পলাশী থেকে দেশভাগ)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-his-302", code: "231503", name: "History of Modern India (1757-1947) / আধুনিক ভারতের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-his-303", code: "231505", name: "History of Modern Europe (1789-1919) / আধুনিক ইউরোপের ইতিহাস (ফরাসি বিপ্লব)", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-his-304", code: "231507", name: "History of the USA (Up to 1945) / মার্কিন যুক্তরাষ্ট্রের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৩য় বর্ষ (পর্ব-২)",
        semesterNameEn: "3rd Year (Part 2)",
        courses: [
          { id: "nu-his-305", code: "231509", name: "History of the Middle East (1914-present) / আধুনিক মধ্যপ্রাচ্যের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-his-306", code: "231511", name: "History of Russia and the Soviet Union / রাশিয়া ও সোভিয়েত ইউনিয়নের ইতিহাস", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-his-307", code: "231513", name: "History of East Asia: China and Japan / পূর্ব এশিয়ার ইতিহাস (চীন ও জাপান)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-his-308", code: "231515", name: "Historiography and Historical Method / ইতিহাসতত্ত্ব ও ইতিহাস লিখনপদ্ধতি", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-১)",
        semesterNameEn: "4th Year (Part 1)",
        courses: [
          { id: "nu-his-401", code: "241501", name: "History of Bangladesh (1947 to present) / বাংলাদেশের জাতীয় ইতিহাস (ভাষা আন্দোলন ও মুক্তিযুদ্ধ)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-his-402", code: "241503", name: "International Relations & World Politics (1945-present) / সমকালীন বিশ্বরাজনীতি ও স্নায়ুযুদ্ধ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-his-403", code: "241505", name: "Constitutional History of Bangladesh / বাংলাদেশের সাংবিধানিক ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-his-404", code: "241507", name: "History of Resistance & Peasant Movements in Bengal / কৃষক ও গণসংগ্রামের ইতিহাস", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-২)",
        semesterNameEn: "4th Year (Part 2)",
        courses: [
          { id: "nu-his-405", code: "241509", name: "Socio-Economic & Cultural History of Bengal / বাংলার সামাজিক, অর্থনৈতিক ও সাংস্কৃতিক ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-his-406", code: "241511", name: "War of Liberation 1971 & Genocide / ১৯৭১ সালের মুক্তিযুদ্ধ ও গণহত্যা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-his-407", code: "241513", name: "Archaeology & Museums in Bangladesh / বাংলাদেশের প্রত্নতত্ত্ব ও জাদুঘর", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-his-408", code: "241518", name: "Comprehensive Viva-Voce / মৌখিক পরীক্ষা ও মনোগ্রাফ", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // 27. NU Islamic History & Culture (ইসলামের ইতিহাস ও সংস্কৃতি)
  nu_islamic_history: {
    key: "nu_islamic_history",
    category: "NU",
    categoryLabelBn: "জাতীয় বিশ্ববিদ্যালয় অনার্স (NU Honours)",
    titleBn: "ইসলামের ইতিহাস ও সংস্কৃতি — বিএ (অনার্স) · জাতীয় বিশ্ববিদ্যালয় / রাজশাহী কলেজ",
    titleEn: "B.A. (Hons) in Islamic History & Culture (National University Framework)",
    typicalTotalCredits: 124,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম বর্ষ (পর্ব-১)",
        semesterNameEn: "1st Year (Part 1)",
        courses: [
          { id: "nu-ih-101", code: "211601", name: "History of the Muslims: Prophet & Khulafa / মহানবী (সা.) ও খোলাফায়ে রাশেদীনের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ih-102", code: "211603", name: "History of the Umayyads (661-750 AD) / উমাইয়া খেলাফতের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ih-103", code: "211605", name: "History of the Abbasids (750-1258 AD) / আব্বাসীয় খেলাফতের ইতিহাস", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "১ম বর্ষ (পর্ব-২)",
        semesterNameEn: "1st Year (Part 2)",
        courses: [
          { id: "nu-ih-104", code: "211501", name: "History of Emergence of Independent BD / স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ih-105", code: "211909", name: "Political Science Principles / রাষ্ট্রবিজ্ঞানের মূলনীতি", credits: 4.0, gradePoint: 3.5 },
          { id: "nu-ih-106", code: "212009", name: "Principles of Sociology / সমাজবিজ্ঞানের মূলনীতি", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "২য় বর্ষ (পর্ব-১)",
        semesterNameEn: "2nd Year (Part 1)",
        courses: [
          { id: "nu-ih-201", code: "221601", name: "History of Muslims in Spain (711-1492 AD) / স্পেনে মুসলিম শাসন ও কর্ডোভা সভ্যতা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ih-202", code: "221603", name: "History of the Fatimids in Egypt / মিশরে ফাতেমীয় খেলাফত", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-ih-203", code: "221605", name: "History of the Ottoman Turks (1299-1924 AD) / উসমানীয় তুর্কি সাম্রাজ্যের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "২য় বর্ষ (পর্ব-২)",
        semesterNameEn: "2nd Year (Part 2)",
        courses: [
          { id: "nu-ih-204", code: "221607", name: "History of Muslims in India (712-1526 AD) / ভারতে মুসলিম শাসন (সুলতানি আমল)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ih-205", code: "221909", name: "Government and Politics in BD / বাংলাদেশের সরকার ও রাজনীতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-ih-206", code: "222009", name: "Sociology of Bangladesh / বাংলাদেশের সমাজবিজ্ঞান", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৩য় বর্ষ (পর্ব-১)",
        semesterNameEn: "3rd Year (Part 1)",
        courses: [
          { id: "nu-ih-301", code: "231601", name: "History of Mughal India (1526-1857 AD) / ভারতে মুঘল সাম্রাজ্যের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ih-302", code: "231603", name: "History of Muslim Rule in Bengal (1204-1757 AD) / বাংলায় মুসলিম শাসনের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ih-303", code: "231605", name: "Islamic Art, Architecture and Calligraphy / ইসলামী চিত্রকলা ও স্থাপত্যশিল্প", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ih-304", code: "231607", name: "Sufism & Islam in Bengal / সুফিবাদ ও বাংলায় ইসলামের প্রচার", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৩য় বর্ষ (পর্ব-২)",
        semesterNameEn: "3rd Year (Part 2)",
        courses: [
          { id: "nu-ih-305", code: "231609", name: "Development of Science & Philosophy in Islam / ইসলামে বিজ্ঞান ও দর্শনের বিকাশ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ih-306", code: "231611", name: "Modern Muslim World & West Asia / আধুনিক মুসলিম বিশ্ব ও মধ্যপ্রাচ্য", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-ih-307", code: "231613", name: "Muslim Historiography / মুসলিম ইতিহাসতত্ত্ব", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-ih-308", code: "231615", name: "Political Thought in Islam / ইসলামে রাষ্ট্রচিন্তা", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-১)",
        semesterNameEn: "4th Year (Part 1)",
        courses: [
          { id: "nu-ih-401", code: "241601", name: "History of Muslims in Bengal (1757-1947 AD) / আধুনিক যুগে বাংলার মুসলিম সমাজ ও রাজনীতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ih-402", code: "241603", name: "Muslim Reform Movements in Subcontinent / উপমহাদেশে মুসলিম সংস্কার আন্দোলন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ih-403", code: "241605", name: "Islamic Economic and Banking System / ইসলামী অর্থব্যবস্থা ও ব্যাংকিং", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ih-404", code: "241607", name: "Archaeology and Islamic Monuments in BD / বাংলাদেশে ইসলামী প্রত্নতত্ত্ব ও সৌধ", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-২)",
        semesterNameEn: "4th Year (Part 2)",
        courses: [
          { id: "nu-ih-405", code: "241609", name: "History of Bangladesh (1947-present) / সমকালীন বাংলাদেশের ইতিহাস ও মুক্তিযুদ্ধ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ih-406", code: "241611", name: "Contemporary Muslim Crisis & Palestine / ফিলিস্তিন ও সমকালীন মুসলিম বিশ্বের সংকট", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ih-407", code: "241613", name: "Research Methodology in Islamic History / গবেষণা পদ্ধতি ও মনোগ্রাফ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ih-408", code: "241618", name: "Comprehensive Viva-Voce / মৌখিক পরীক্ষা", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },
`;

const targetAnchor = '  },\n\n};';
const index = code.lastIndexOf(targetAnchor);

if (index === -1) {
  console.error("Could not find anchor '  },\\n\\n};'");
  process.exit(1);
}

const updatedCode = code.slice(0, index + 4) + nuPrograms + code.slice(index + 4);
fs.writeFileSync(filePath, updatedCode, 'utf8');
console.log('Successfully injected National University Honours programs into cgpa-grade-engine.ts');
