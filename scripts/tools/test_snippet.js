import fs from 'fs';

const filePath = 'src/lib/education/cgpa-grade-engine.ts';
let code = fs.readFileSync(filePath, 'utf8');

// 1. Update DegreeCategory to include "NU"
if (!code.includes('"NU" | "BSC"')) {
  code = code.replace(
    'export type DegreeCategory = "BSC" | "BBA" | "BA" | "DIPLOMA";',
    'export type DegreeCategory = "NU" | "BSC" | "BBA" | "BA" | "DIPLOMA";'
  );
}

// 2. Build the 23 Rajshahi College & NU Honours Departments
const nuCatalog = `
  /* =========================================================================
   * NATIONAL UNIVERSITY (NU) HONOURS — RAJSHAHI COLLEGE & AFFILIATED COLLEGES
   * 23 Comprehensive Departments across Faculty of Arts, Social Science, Science & Business
   * ========================================================================= */

  // NU 1. Political Science (রাষ্ট্রবিজ্ঞান)
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
          { id: "nu-ps-103", code: "211905", name: "Political & Constitutional Dev in BD (1947 to date) / বাংলাদেশের রাজনৈতিক ও সাংবিধানিক উন্নয়ন", credits: 4.0, gradePoint: 4.0 },
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

  // NU 2. Sociology (সমাজবিজ্ঞান)
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

  // NU 3. Social Work (সমাজকর্ম)
  nu_social_work: {
    key: "nu_social_work",
    category: "NU",
    categoryLabelBn: "জাতীয় বিশ্ববিদ্যালয় অনার্স (NU Honours)",
    titleBn: "সমাজকর্ম — বিএসএস (অনার্স) · জাতীয় বিশ্ববিদ্যালয় / রাজশাহী কলেজ",
    titleEn: "B.S.S. (Hons) in Social Work (National University Framework)",
    typicalTotalCredits: 128,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম বর্ষ (পর্ব-১)",
        semesterNameEn: "1st Year (Part 1)",
        courses: [
          { id: "nu-sw-101", code: "212101", name: "Introduction to Social Work / সমাজকর্ম পরিচিতি ও ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-sw-102", code: "212103", name: "History & Philosophy of Social Work / সমাজকর্মের দর্শন ও বিকাশ", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-sw-103", code: "212105", name: "Human Biology & Psychology / মানব শারীরতত্ত্ব ও বিকাশ মনোবিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "১ম বর্ষ (পর্ব-২)",
        semesterNameEn: "1st Year (Part 2)",
        courses: [
          { id: "nu-sw-104", code: "212107", name: "Bangladesh Society and Culture / বাংলাদেশের সমাজ ও সংস্কৃতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-sw-105", code: "211501", name: "History of Emergence of Independent BD / স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-sw-106", code: "212009", name: "Principles of Sociology / সমাজবিজ্ঞানের মূলনীতি", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "২য় বর্ষ (পর্ব-১)",
        semesterNameEn: "2nd Year (Part 1)",
        courses: [
          { id: "nu-sw-201", code: "222101", name: "Social Work Methods: Casework & Groupwork / সমাজকর্মের পদ্ধতি: ব্যক্তি ও দল সমাজকর্ম", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-sw-202", code: "222103", name: "Community Organization & Development / সম্প্রদায় সংগঠন ও সামাজিক উন্নয়ন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-sw-203", code: "222105", name: "Social Problems & Social Welfare in BD / বাংলাদেশের সামাজিক সমস্যা ও কল্যাণ", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "২য় বর্ষ (পর্ব-২)",
        semesterNameEn: "2nd Year (Part 2)",
        courses: [
          { id: "nu-sw-204", code: "222107", name: "Social Legislation and Human Rights / সামাজিক আইন ও মানবাধিকার", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-sw-205", code: "221909", name: "Govt & Politics in Bangladesh / বাংলাদেশের সরকার ও রাজনীতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-sw-206", code: "222209", name: "Bangladesh Economy / বাংলাদেশের অর্থনীতি", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৩য় বর্ষ (পর্ব-১)",
        semesterNameEn: "3rd Year (Part 1)",
        courses: [
          { id: "nu-sw-301", code: "232101", name: "Social Research and Statistics / সামাজিক গবেষণা ও পরিসংখ্যান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-sw-302", code: "232103", name: "Social Policy and Planning / সামাজিক নীতি ও সামাজিক পরিকল্পনা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-sw-303", code: "232105", name: "Social Welfare Administration / সমাজকল্যাণ প্রশাসন ও এনজিও", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-sw-304", code: "232107", name: "Child and Youth Welfare / শিশু ও যুবকল্যাণ", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৩য় বর্ষ (পর্ব-২)",
        semesterNameEn: "3rd Year (Part 2)",
        courses: [
          { id: "nu-sw-305", code: "232109", name: "Women and Gender in Social Work / নারী ও জেন্ডার কল্যাণ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-sw-306", code: "232111", name: "Medical and Psychiatric Social Work / চিকিৎসা ও মানসিক স্বাস্থ্য সমাজকর্ম", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-sw-307", code: "232113", name: "Gerontology & Elderly Welfare / প্রবীণ কল্যাণ ও জেরন্টোলজি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-sw-308", code: "232115", name: "Correctional Services and Criminology / অপরাধ সংশোধন ও অপরাধতত্ত্ব", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-১)",
        semesterNameEn: "4th Year (Part 1)",
        courses: [
          { id: "nu-sw-401", code: "242101", name: "Rural & Urban Community Development / গ্রামীণ ও নগর সম্প্রদায় উন্নয়ন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-sw-402", code: "242103", name: "Disaster Management & Climate Social Work / দুর্যোগ ব্যবস্থাপনা ও সমাজকর্ম", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-sw-403", code: "242105", name: "Industrial Social Work & Labor Welfare / শিল্প সমাজকর্ম ও শ্রম কল্যাণ", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-sw-404", code: "242107", name: "Project Planning and Management / প্রকল্প প্রণয়ন ও মূল্যায়ন", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-২)",
        semesterNameEn: "4th Year (Part 2)",
        courses: [
          { id: "nu-sw-405", code: "242109", name: "Field Work Practice (Practicum) / মাঠকর্ম অনুশীলন ও রিপোর্ট", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-sw-406", code: "242111", name: "Contemporary Social Work Issues / সমকালীন সমাজকর্ম সমস্যা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-sw-407", code: "242113", name: "Social Advocacy and Empowerment / সামাজিক সমর্থন ও ক্ষমতায়ন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-sw-408", code: "242118", name: "Comprehensive Viva-Voce / মৌখিক পরীক্ষা", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // NU 4. Economics (অর্থনীতি)
  nu_economics: {
    key: "nu_economics",
    category: "NU",
    categoryLabelBn: "জাতীয় বিশ্ববিদ্যালয় অনার্স (NU Honours)",
    titleBn: "অর্থনীতি — বিএসএস (অনার্স) · জাতীয় বিশ্ববিদ্যালয় / রাজশাহী কলেজ",
    titleEn: "B.S.S. (Hons) in Economics (National University Framework)",
    typicalTotalCredits: 128,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম বর্ষ (পর্ব-১)",
        semesterNameEn: "1st Year (Part 1)",
        courses: [
          { id: "nu-econ-101", code: "212201", name: "Basic Microeconomics / মৌলিক ব্যাষ্টিক অর্থনীতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-econ-102", code: "212203", name: "Basic Macroeconomics / মৌলিক সামষ্টিক অর্থনীতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-econ-103", code: "212205", name: "Basic Mathematics for Economics / অর্থনীতির জন্য মৌলিক গণিত", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "১ম বর্ষ (পর্ব-২)",
        semesterNameEn: "1st Year (Part 2)",
        courses: [
          { id: "nu-econ-104", code: "212207", name: "Basic Statistics for Economics / অর্থনীতির জন্য মৌলিক পরিসংখ্যান", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-econ-105", code: "211501", name: "History of Emergence of Independent BD / স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-econ-106", code: "211909", name: "Principles of Political Science / রাষ্ট্রবিজ্ঞানের মূলনীতি", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "২য় বর্ষ (পর্ব-১)",
        semesterNameEn: "2nd Year (Part 1)",
        courses: [
          { id: "nu-econ-201", code: "222201", name: "Intermediate Microeconomics / মধ্যবর্তী ব্যাষ্টিক অর্থনীতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-econ-202", code: "222203", name: "Intermediate Macroeconomics / মধ্যবর্তী সামষ্টিক অর্থনীতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-econ-203", code: "222205", name: "Mathematical Economics / গাণিতিক অর্থনীতি", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "২য় বর্ষ (পর্ব-২)",
        semesterNameEn: "2nd Year (Part 2)",
        courses: [
          { id: "nu-econ-204", code: "222207", name: "Introduction to Econometrics / অর্থনীতিমিতি পরিচিতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-econ-205", code: "221909", name: "Government and Politics in BD / বাংলাদেশের সরকার ও রাজনীতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-econ-206", code: "222009", name: "Sociology of Bangladesh / বাংলাদেশের সমাজবিজ্ঞান", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৩য় বর্ষ (পর্ব-১)",
        semesterNameEn: "3rd Year (Part 1)",
        courses: [
          { id: "nu-econ-301", code: "232201", name: "Advanced Microeconomics / উচ্চতর ব্যাষ্টিক অর্থনীতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-econ-302", code: "232203", name: "Advanced Macroeconomics / উচ্চতর সামষ্টিক অর্থনীতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-econ-303", code: "232205", name: "International Economics-I / আন্তর্জাতিক অর্থনীতি-১ (বাণিজ্য তত্ত্ব)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-econ-304", code: "232207", name: "Public Finance / সরকারি অর্থব্যবস্থা ও রাজস্ব", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৩য় বর্ষ (পর্ব-২)",
        semesterNameEn: "3rd Year (Part 2)",
        courses: [
          { id: "nu-econ-305", code: "232209", name: "Money, Banking and Financial Institutions / অর্থ, ব্যাংকিং ও আর্থিক প্রতিষ্ঠান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-econ-306", code: "232211", name: "Development Economics / উন্নয়ন অর্থনীতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-econ-307", code: "232213", name: "Agricultural & Rural Economics / কৃষি ও গ্রামীণ অর্থনীতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-econ-308", code: "232215", name: "Research Methodology in Economics / অর্থনীতিতে গবেষণা পদ্ধতি", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-১)",
        semesterNameEn: "4th Year (Part 1)",
        courses: [
          { id: "nu-econ-401", code: "242201", name: "Bangladesh Economy: Issues & Challenges / বাংলাদেশের অর্থনীতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-econ-402", code: "242203", name: "International Economics-II / আন্তর্জাতিক অর্থনীতি-২ (অর্থনীতি ও লেনদেন ভারসাম্য)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-econ-403", code: "242205", name: "Environmental & Resource Economics / পরিবেশ ও প্রাকৃতিক সম্পদ অর্থনীতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-econ-404", code: "242207", name: "Applied Econometrics & Stata / ফলিত অর্থনীতিমিতি", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-২)",
        semesterNameEn: "4th Year (Part 2)",
        courses: [
          { id: "nu-econ-405", code: "242209", name: "Industrial Economics & Regulations / শিল্প অর্থনীতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-econ-406", code: "242211", name: "Health and Labor Economics / স্বাস্থ্য ও শ্রম অর্থনীতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-econ-407", code: "242213", name: "Project Analysis & Cost-Benefit Evaluation / প্রকল্প মূল্যায়ন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-econ-408", code: "242218", name: "Comprehensive Viva-Voce / মৌখিক পরীক্ষা ও টার্ম পেপার", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },
`;

console.log("NU Catalog snippet prepared.");
