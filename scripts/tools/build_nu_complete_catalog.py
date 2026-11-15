#!/usr/bin/env python3
"""
Complete National University (NU) & Rajshahi College Honours Catalog Generator
Injects 23 Honours departments across Arts, Social Science, Science & Business.
Each with 4 full years (8 semester parts), official 6-digit paper codes,
and bilingual English / Bangla paper titles.
"""

import re
import sys

ENGINE_FILE = "src/lib/education/cgpa-grade-engine.ts"

with open(ENGINE_FILE, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Ensure DegreeCategory includes "NU"
if '"NU" | "BSC"' not in content:
    content = content.replace(
        'export type DegreeCategory = "BSC" | "BBA" | "BA" | "DIPLOMA";',
        'export type DegreeCategory = "NU" | "BSC" | "BBA" | "BA" | "DIPLOMA";'
    )

# 2. Check if nu_political_science is already present
if 'nu_political_science:' in content:
    print("NU departments already present in file. Removing old NU block before clean reinjection.")
    content = re.sub(r'  /\* =+ \*\s*\* NATIONAL UNIVERSITY \(NU\) HONOURS.*?(?=  \/\/ 18\.|\/\/ End of programs|};\s*\/\* =+)', '', content, flags=re.DOTALL)

# Let's read the full NU 23 departments catalog definitions
NU_DEPARTMENTS = """
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

  // NU 5. Accounting (হিসাববিজ্ঞান)
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

  // NU 6. Management (ব্যবস্থাপনা)
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

  // NU 7. Finance & Banking (ফিন্যান্স ও ব্যাংকিং)
  nu_finance: {
    key: "nu_finance",
    category: "NU",
    categoryLabelBn: "জাতীয় বিশ্ববিদ্যালয় অনার্স (NU Honours)",
    titleBn: "ফিন্যান্স ও ব্যাংকিং — বিবিএ (অনার্স) · জাতীয় বিশ্ববিদ্যালয় / রাজশাহী কলেজ",
    titleEn: "B.B.A. (Hons) in Finance & Banking (National University Framework)",
    typicalTotalCredits: 128,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম বর্ষ (পর্ব-১)",
        semesterNameEn: "1st Year (Part 1)",
        courses: [
          { id: "nu-fin-101", code: "212401", name: "Principles of Finance / অর্থায়নের মূলনীতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-fin-102", code: "212403", name: "Principles of Accounting / হিসাববিজ্ঞানের মূলনীতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-fin-103", code: "212405", name: "Principles of Management / ব্যবস্থাপনার মূলনীতি", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "১ম বর্ষ (পর্ব-২)",
        semesterNameEn: "1st Year (Part 2)",
        courses: [
          { id: "nu-fin-104", code: "212407", name: "Principles of Marketing / বাজারজাতকরণের মূলনীতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-fin-105", code: "211501", name: "History of Emergence of Independent BD / স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-fin-106", code: "212409", name: "Business Mathematics / ব্যবসায় গণিত", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "২য় বর্ষ (পর্ব-১)",
        semesterNameEn: "2nd Year (Part 1)",
        courses: [
          { id: "nu-fin-201", code: "222401", name: "Financial Management / আর্থিক ব্যবস্থাপনা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-fin-202", code: "222403", name: "Commercial Banking & Central Banking / বাণিজ্যিক ব্যাংকিং ও কেন্দ্রীয় ব্যাংক", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-fin-203", code: "222405", name: "Business Statistics / ব্যবসায় পরিসংখ্যান", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "২য় বর্ষ (পর্ব-২)",
        semesterNameEn: "2nd Year (Part 2)",
        courses: [
          { id: "nu-fin-204", code: "222407", name: "Insurance and Risk Management / বিমা ও ঝুঁকি ব্যবস্থাপনা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-fin-205", code: "222409", name: "Business Communication / ব্যবসায় যোগাযোগ", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-fin-206", code: "222411", name: "Macroeconomics for Finance / সামষ্টিক অর্থনীতি", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৩য় বর্ষ (পর্ব-১)",
        semesterNameEn: "3rd Year (Part 1)",
        courses: [
          { id: "nu-fin-301", code: "232401", name: "Corporate Finance & Capital Budgeting / করপোরেট ফিন্যান্স", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-fin-302", code: "232403", name: "Financial Markets and Institutions / আর্থিক বাজার ও প্রতিষ্ঠান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-fin-303", code: "232405", name: "Credit Management & SME Financing / ঋণ ব্যবস্থাপনা ও এসএমই ঋণ", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-fin-304", code: "232407", name: "Islamic Banking & Finance / ইসলামী ব্যাংকিং ও সুকুক", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৩য় বর্ষ (পর্ব-২)",
        semesterNameEn: "3rd Year (Part 2)",
        courses: [
          { id: "nu-fin-305", code: "232409", name: "Working Capital Management / চলতি মূলধন ব্যবস্থাপনা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-fin-306", code: "232411", name: "Security Analysis & Portfolio Management / সিকিউরিটি বিশ্লেষণ ও পোর্টফোলিও", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-fin-307", code: "232413", name: "Real Estate and Infrastructure Finance / রিয়েল এস্টেট অর্থায়ন", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-fin-308", code: "232415", name: "Financial Econometrics / আর্থিক অর্থনীতিমিতি", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-১)",
        semesterNameEn: "4th Year (Part 1)",
        courses: [
          { id: "nu-fin-401", code: "242401", name: "International Financial Management / আন্তর্জাতিক আর্থিক ব্যবস্থাপনা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-fin-402", code: "242403", name: "Financial Derivatives & Financial Engineering / আর্থিক ডেরিভেটিভস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-fin-403", code: "242405", name: "Bank Fund Management & ALM / ব্যাংক ফান্ড ব্যবস্থাপনা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-fin-404", code: "242407", name: "Investment Banking & Corporate Restructuring / ইনভেস্টমেন্ট ব্যাংকিং ও মার্জার", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-২)",
        semesterNameEn: "4th Year (Part 2)",
        courses: [
          { id: "nu-fin-405", code: "242409", name: "Microfinance & Rural Banking in BD / ক্ষুদ্রঋণ ও গ্রামীণ ব্যাংকিং", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-fin-406", code: "242411", name: "Financial Statement Analysis & Valuation / আর্থিক বিবরণী বিশ্লেষণ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-fin-407", code: "242413", name: "Research Methodology in Finance / ফিন্যান্সে গবেষণা পদ্ধতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-fin-408", code: "242418", name: "Comprehensive Viva-Voce / মৌখিক পরীক্ষা ও ইন্টার্নশিপ", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // NU 8. Marketing (মার্কেটিং)
  nu_marketing: {
    key: "nu_marketing",
    category: "NU",
    categoryLabelBn: "জাতীয় বিশ্ববিদ্যালয় অনার্স (NU Honours)",
    titleBn: "মার্কেটিং — বিবিএ (অনার্স) · জাতীয় বিশ্ববিদ্যালয় / রাজশাহী কলেজ",
    titleEn: "B.B.A. (Hons) in Marketing (National University Framework)",
    typicalTotalCredits: 128,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম বর্ষ (পর্ব-১)",
        semesterNameEn: "1st Year (Part 1)",
        courses: [
          { id: "nu-mkt-101", code: "212301", name: "Principles of Marketing / বাজারজাতকরণের মূলনীতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mkt-102", code: "212303", name: "Introduction to Business / ব্যবসায় পরিচিতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mkt-103", code: "212305", name: "Principles of Accounting / হিসাববিজ্ঞানের মূলনীতি", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "১ম বর্ষ (পর্ব-২)",
        semesterNameEn: "1st Year (Part 2)",
        courses: [
          { id: "nu-mkt-104", code: "212307", name: "Principles of Management / ব্যবস্থাপনার মূলনীতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-mkt-105", code: "211501", name: "History of Emergence of Independent BD / স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mkt-106", code: "212309", name: "Business Mathematics / ব্যবসায় গণিত", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "২য় বর্ষ (পর্ব-১)",
        semesterNameEn: "2nd Year (Part 1)",
        courses: [
          { id: "nu-mkt-201", code: "222301", name: "Consumer Behavior / ভোক্তা আচরণ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mkt-202", code: "222303", name: "Marketing Management / মার্কেটিং ব্যবস্থাপনা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mkt-203", code: "222305", name: "Business Statistics / ব্যবসায় পরিসংখ্যান", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "২য় বর্ষ (পর্ব-২)",
        semesterNameEn: "2nd Year (Part 2)",
        courses: [
          { id: "nu-mkt-204", code: "222307", name: "Business Communication / ব্যবসায় যোগাযোগ", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-mkt-205", code: "222309", name: "Principles of Finance / অর্থায়নের মূলনীতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-mkt-206", code: "222311", name: "Legal Aspects of Marketing / মার্কেটিংয়ের আইনগত দিক", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৩য় বর্ষ (পর্ব-১)",
        semesterNameEn: "3rd Year (Part 1)",
        courses: [
          { id: "nu-mkt-301", code: "232301", name: "Advertising & Promotion Management / বিজ্ঞাপন ও প্রচার ব্যবস্থাপনা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mkt-302", code: "232303", name: "Brand Management / ব্র্যান্ড ব্যবস্থাপনা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mkt-303", code: "232305", name: "Sales Management & Negotiation / বিক্রয় ব্যবস্থাপনা", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-mkt-304", code: "232307", name: "Services Marketing / সেবা বাজারজাতকরণ", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৩য় বর্ষ (পর্ব-২)",
        semesterNameEn: "3rd Year (Part 2)",
        courses: [
          { id: "nu-mkt-305", code: "232309", name: "Digital Marketing & Social Media / ডিজিটাল মার্কেটিং ও সোশ্যাল মিডিয়া", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mkt-306", code: "232311", name: "Marketing Research / বিপণন গবেষণা পদ্ধতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mkt-307", code: "232313", name: "Supply Chain & Distribution Logistics / সরবরাহ শৃঙ্খল ও বিতরণ", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-mkt-308", code: "232315", name: "Pricing Strategy & Revenue Management / মূল্য নির্ধারণ কৌশল", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-১)",
        semesterNameEn: "4th Year (Part 1)",
        courses: [
          { id: "nu-mkt-401", code: "242301", name: "Strategic Marketing / কৌশলগত বিপণন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mkt-402", code: "242303", name: "International Marketing & Export-Import / আন্তর্জাতিক বিপণন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mkt-403", code: "242305", name: "Retail Marketing & E-Commerce / রিটেল মার্কেটিং ও ই-কমার্স", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mkt-404", code: "242307", name: "Agricultural & Rural Marketing in BD / কৃষি ও গ্রামীণ বাজারজাতকরণ", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-২)",
        semesterNameEn: "4th Year (Part 2)",
        courses: [
          { id: "nu-mkt-405", code: "242309", name: "Relationship Marketing & CRM / রিলেশনশিপ মার্কেটিং", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mkt-406", code: "242311", name: "Marketing Ethics & Social Responsibility / বিপণন নীতিশাস্ত্র", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-mkt-407", code: "242313", name: "Contemporary Issues in Marketing / মার্কেটিংয়ে সমকালীন বিষয়", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-mkt-408", code: "242318", name: "Comprehensive Viva-Voce / মৌখিক পরীক্ষা ও ইন্টার্নশিপ", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // NU 9. Physics (পদার্থবিজ্ঞান)
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

  // NU 10. Chemistry (রসায়ন)
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
          { id: "nu-ch-406", code: "242811", name: "Polymer Chemistry & Nanomaterials / পলিমার ও ন্যানোম্যাটেরিয়াল", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ch-407", code: "242814", name: "Advanced Chemistry Practical-IV / উচ্চতর ব্যবহারিক-৪", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ch-408", code: "242818", name: "Comprehensive Viva-Voce / মৌখিক পরীক্ষা ও প্রজেক্ট", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // NU 11. Mathematics (গণিত)
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
          { id: "nu-math-101", code: "213701", name: "Fundamentals of Mathematics / গণিতের মূলভিত্তি ও সেটতত্ত্ব", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-math-102", code: "213703", name: "Calculus-I (Differential & Integral) / ক্যালকুলাস-১", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-math-103", code: "213705", name: "Linear Algebra / রৈখিক বীজগণিত", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "১ম বর্ষ (পর্ব-২)",
        semesterNameEn: "1st Year (Part 2)",
        courses: [
          { id: "nu-math-104", code: "213707", name: "Analytic and Vector Geometry / স্থানাঙ্ক ও ভেক্টর জ্যামিতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-math-105", code: "211501", name: "History of Emergence of Independent BD / স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-math-106", code: "212709", name: "Physics-I for Mathematics / পদার্থবিজ্ঞান-১", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "২য় বর্ষ (পর্ব-১)",
        semesterNameEn: "2nd Year (Part 1)",
        courses: [
          { id: "nu-math-201", code: "223701", name: "Calculus-II (Multivariate Calculus) / ক্যালকুলাস-২ (বহুচলক)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-math-202", code: "223703", name: "Ordinary Differential Equations / সাধারণ অন্তরক সমীকরণ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-math-203", code: "223705", name: "Fortran & Python Programming Lab / কম্পিউটার প্রোগ্রামিং ল্যাব", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "২য় বর্ষ (পর্ব-২)",
        semesterNameEn: "2nd Year (Part 2)",
        courses: [
          { id: "nu-math-204", code: "223707", name: "Mathematical Methods / গাণিতিক পদ্ধতিসমূহ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-math-205", code: "222709", name: "Physics-II for Mathematics / পদার্থবিজ্ঞান-২", credits: 4.0, gradePoint: 3.5 },
          { id: "nu-math-206", code: "223609", name: "Statistics for Mathematics / পরিসংখ্যান", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৩য় বর্ষ (পর্ব-১)",
        semesterNameEn: "3rd Year (Part 1)",
        courses: [
          { id: "nu-math-301", code: "233701", name: "Abstract Algebra / বিমূর্ত বীজগণিত (গ্রুপ ও রিং)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-math-302", code: "233703", name: "Real Analysis / বাস্তব বিশ্লেষণ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-math-303", code: "233705", name: "Numerical Analysis-I / সংখ্যাতাত্ত্বিক বিশ্লেষণ-১", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-math-304", code: "233707", name: "Complex Analysis / জটিল বিশ্লেষণ", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৩য় বর্ষ (পর্ব-২)",
        semesterNameEn: "3rd Year (Part 2)",
        courses: [
          { id: "nu-math-305", code: "233709", name: "Classical Mechanics / চিরায়ত বলবিদ্যা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-math-306", code: "233711", name: "Linear Programming & Optimization / রৈখিক প্রোগ্রামিং", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-math-307", code: "233713", name: "Differential Geometry / অন্তরক জ্যামিতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-math-308", code: "233714", name: "Math Lab (MATLAB & Mathematica) / ম্যাথ ল্যাব", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-১)",
        semesterNameEn: "4th Year (Part 1)",
        courses: [
          { id: "nu-math-401", code: "243701", name: "Theory of Numbers / সংখ্যাতত্ত্ব", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-math-402", code: "243703", name: "Topology & Functional Analysis / টপোলজি ও ফাংশনাল অ্যানালাইসিস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-math-403", code: "243705", name: "Partial Differential Equations / আংশিক অন্তরক সমীকরণ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-math-404", code: "243707", name: "Fluid Dynamics / প্রবাহী গতিবিদ্যা", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-২)",
        semesterNameEn: "4th Year (Part 2)",
        courses: [
          { id: "nu-math-405", code: "243709", name: "Hydrodynamics & Tensor Analysis / হাইড্রোডাইনামিক্স ও টেনসর", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-math-406", code: "243711", name: "Operations Research / অপারেশন্স রিসার্চ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-math-407", code: "243713", name: "Mathematical Modeling in Biology / গাণিতিক মডেলিং", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-math-408", code: "243718", name: "Comprehensive Viva-Voce / মৌখিক পরীক্ষা ও প্রজেক্ট", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // NU 12. Botany (উদ্ভিদবিজ্ঞান)
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
          { id: "nu-bot-101", code: "213001", name: "Microbiology & Phycology / অণুজীববিজ্ঞান ও শৈবালবিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-102", code: "213003", name: "Mycology and Plant Pathology / ছত্রাকতত্ত্ব ও উদ্ভিদ রোগতত্ত্ব", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-bot-103", code: "213005", name: "Bryophyta and Pteridophyta / ব্রায়োফাইটা ও টেরিডোফাইটা", credits: 4.0, gradePoint: 4.0 },
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
          { id: "nu-bot-201", code: "223001", name: "Gymnosperms and Paleobotany / ব্যক্তবীজী উদ্ভিদ ও প্রত্নউদ্ভিদবিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-202", code: "223003", name: "Plant Anatomy and Embryology / উদ্ভিদ অঙ্গসংস্থান ও ভ্রূণতত্ত্ব", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-203", code: "223005", name: "Plant Taxonomy & Systematics / উদ্ভিদ শ্রেণীবিন্যাসবিদ্যা", credits: 4.0, gradePoint: 3.75 },
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
          { id: "nu-bot-301", code: "233001", name: "Plant Physiology & Nutrition / উদ্ভিদ শারীরতত্ত্ব ও পুষ্টি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-302", code: "233003", name: "Plant Biochemistry / উদ্ভিদ প্রাণরসায়ন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-303", code: "233005", name: "Plant Ecology & Environmental Science / উদ্ভিদ বাস্তুসংস্থান ও পরিবেশ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-304", code: "233007", name: "Plant Genetics / উদ্ভিদ বংশগতিবিদ্যা", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৩য় বর্ষ (পর্ব-২)",
        semesterNameEn: "3rd Year (Part 2)",
        courses: [
          { id: "nu-bot-305", code: "233009", name: "Cytology & Cytogenetics / কোষবিদ্যা ও কোষবংশগতিবিদ্যা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-306", code: "233011", name: "Agronomy and Horticulture / কৃষিতত্ত্ব ও উদ্যানতত্ত্ব", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-307", code: "233013", name: "Economic Botany & Ethnobotany / অর্থনৈতিক উদ্ভিদবিজ্ঞান", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-bot-308", code: "233014", name: "Botany Practical-III / উদ্ভিদবিজ্ঞান ব্যবহারিক-৩", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-১)",
        semesterNameEn: "4th Year (Part 1)",
        courses: [
          { id: "nu-bot-401", code: "243001", name: "Molecular Biology & Bioinformatics / আণবিক জীববিজ্ঞান ও বায়োইনফরমেটিক্স", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-402", code: "243003", name: "Plant Biotechnology & Tissue Culture / উদ্ভিদ টিস্যু কালচার ও জীবপ্রযুক্তি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-403", code: "243005", name: "Plant Breeding & Crop Improvement / উদ্ভিদ প্রজনন ও শস্য উন্নয়ন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-404", code: "243007", name: "Biodiversity Conservation & Forestry / জীববৈচিত্র্য সংরক্ষণ ও বনবিদ্যা", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-২)",
        semesterNameEn: "4th Year (Part 2)",
        courses: [
          { id: "nu-bot-405", code: "243009", name: "Biostatistics & Research Methodology / জৈবপরিসংখ্যান ও গবেষণা পদ্ধতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-406", code: "243011", name: "Medicinal Plants & Herbal Medicine / ভেষজ উদ্ভিদ ও ওষুধ প্রযুক্তি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-407", code: "243014", name: "Advanced Botany Practical-IV / উচ্চতর ব্যবহারিক-৪", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bot-408", code: "243018", name: "Comprehensive Viva-Voce / মৌখিক পরীক্ষা ও ফিল্ড এক্সকারশন", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // NU 13. Zoology (প্রাণিবিজ্ঞান)
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

  // NU 14. Geography & Environment (ভূগোল ও পরিবেশ)
  nu_geography: {
    key: "nu_geography",
    category: "NU",
    categoryLabelBn: "জাতীয় বিশ্ববিদ্যালয় অনার্স (NU Honours)",
    titleBn: "ভূগোল ও পরিবেশ — বিএসসি / বিএসএস (অনার্স) · জাতীয় বিশ্ববিদ্যালয় / রাজশাহী কলেজ",
    titleEn: "B.Sc./B.S.S. in Geography & Environment (National University Framework)",
    typicalTotalCredits: 128,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম বর্ষ (পর্ব-১)",
        semesterNameEn: "1st Year (Part 1)",
        courses: [
          { id: "nu-geo-101", code: "213201", name: "Introduction to Physical Geography / প্রাকৃতিক ভূগোল পরিচিতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-geo-102", code: "213203", name: "Introduction to Human Geography / মানব ভূগোল পরিচিতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-geo-103", code: "213205", name: "Practical: Cartography & Map Reading / ব্যবহারিক: মানচিত্রাঙ্কন বিদ্যা", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "১ম বর্ষ (পর্ব-২)",
        semesterNameEn: "1st Year (Part 2)",
        courses: [
          { id: "nu-geo-104", code: "213207", name: "Environmental Science Fundamentals / পরিবেশ বিজ্ঞানের মূলনীতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-geo-105", code: "211501", name: "History of Emergence of Independent BD / স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-geo-106", code: "212009", name: "Principles of Sociology / সমাজবিজ্ঞানের মূলনীতি", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "২য় বর্ষ (পর্ব-১)",
        semesterNameEn: "2nd Year (Part 1)",
        courses: [
          { id: "nu-geo-201", code: "223201", name: "Geomorphology / ভূমিরূপবিদ্যা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-geo-202", code: "223203", name: "Climatology and Meteorology / জলবায়ুবিদ্যা ও আবহাওয়া বিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-geo-203", code: "223205", name: "Economic Geography / অর্থনৈতিক ভূগোল", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "২য় বর্ষ (পর্ব-২)",
        semesterNameEn: "2nd Year (Part 2)",
        courses: [
          { id: "nu-geo-204", code: "223206", name: "Practical: Surveying and Leveling / ব্যবহারিক: ভূমি জরিপ ও লেভেলিং", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-geo-205", code: "221909", name: "Government and Politics in BD / বাংলাদেশের সরকার ও রাজনীতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-geo-206", code: "222209", name: "Bangladesh Economy / বাংলাদেশের অর্থনীতি", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৩য় বর্ষ (পর্ব-১)",
        semesterNameEn: "3rd Year (Part 1)",
        courses: [
          { id: "nu-geo-301", code: "233201", name: "Oceanography & Hydrology / সমুদ্রবিজ্ঞান ও জলবিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-geo-302", code: "233203", name: "Population and Settlement Geography / জনসংখ্যা ও বসতি ভূগোল", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-geo-303", code: "233205", name: "Soil & Biogeography / মৃত্তিকা ও জৈবভূগোল", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-geo-304", code: "233207", name: "Geography of Bangladesh / বাংলাদেশের আঞ্চলিক ভূগোল", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৩য় বর্ষ (পর্ব-২)",
        semesterNameEn: "3rd Year (Part 2)",
        courses: [
          { id: "nu-geo-305", code: "233209", name: "Urban Geography & Spatial Planning / নগর ভূগোল ও পরিকল্পনা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-geo-306", code: "233211", name: "GIS and Remote Sensing Basics / জিআইএস ও রিমোট সেন্সিং", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-geo-307", code: "233213", name: "Statistical Techniques in Geography / ভূগোলে পরিসংখ্যানিক পদ্ধতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-geo-308", code: "233214", name: "Practical: Quantitative & GIS Lab / জিআইএস ল্যাব ব্যবহারিক", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-১)",
        semesterNameEn: "4th Year (Part 1)",
        courses: [
          { id: "nu-geo-401", code: "243201", name: "Disaster Management & Climate Change in BD / দুর্যোগ ব্যবস্থাপনা ও জলবায়ু পরিবর্তন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-geo-402", code: "243203", name: "Environmental Impact Assessment (EIA) / পরিবেশ প্রভাব সমীক্ষা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-geo-403", code: "243205", name: "Political Geography & Geopolitics / রাজনৈতিক ভূগোল ও ভূরাজনীতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-geo-404", code: "243207", name: "Natural Resource Management / প্রাকৃতিক সম্পদ ব্যবস্থাপনা", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-২)",
        semesterNameEn: "4th Year (Part 2)",
        courses: [
          { id: "nu-geo-405", code: "243209", name: "Advanced GIS & Digital Image Processing / উচ্চতর জিআইএস ও ডিজিটাল চিত্র বিশ্লেষণ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-geo-406", code: "243211", name: "Regional Planning & Development / আঞ্চলিক পরিকল্পনা ও উন্নয়ন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-geo-407", code: "243214", name: "Practical: Research Field Report / ফিল্ড রিপোর্ট ও সমীক্ষা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-geo-408", code: "243218", name: "Comprehensive Viva-Voce / মৌখিক পরীক্ষা", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // NU 15. Psychology (মনোবিজ্ঞান)
  nu_psychology: {
    key: "nu_psychology",
    category: "NU",
    categoryLabelBn: "জাতীয় বিশ্ববিদ্যালয় অনার্স (NU Honours)",
    titleBn: "মনোবিজ্ঞান — বিএসসি / বিএ (অনার্স) · জাতীয় বিশ্ববিদ্যালয় / রাজশাহী কলেজ",
    titleEn: "B.Sc./B.A. (Hons) in Psychology (National University Framework)",
    typicalTotalCredits: 128,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম বর্ষ (পর্ব-১)",
        semesterNameEn: "1st Year (Part 1)",
        courses: [
          { id: "nu-psy-101", code: "213401", name: "General Psychology / সাধারণ মনোবিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-psy-102", code: "213403", name: "History and Schools of Psychology / মনোবিজ্ঞানের ইতিহাস ও মতবাদ", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-psy-103", code: "213405", name: "Experimental Psychology & Lab / পরীক্ষণ মনোবিজ্ঞান ও ল্যাব", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "১ম বর্ষ (পর্ব-২)",
        semesterNameEn: "1st Year (Part 2)",
        courses: [
          { id: "nu-psy-104", code: "213407", name: "Psychological Statistics-I / মনস্তাত্ত্বিক পরিসংখ্যান-১", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-psy-105", code: "211501", name: "History of Emergence of Independent BD / স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-psy-106", code: "212009", name: "Principles of Sociology / সমাজবিজ্ঞানের মূলনীতি", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "২য় বর্ষ (পর্ব-১)",
        semesterNameEn: "2nd Year (Part 1)",
        courses: [
          { id: "nu-psy-201", code: "223401", name: "Developmental Psychology (Child & Adolescent) / বিকাশ মনোবিজ্ঞান (শিশু ও কিশোর)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-psy-202", code: "223403", name: "Social Psychology / সামাজিক মনোবিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-psy-203", code: "223405", name: "Psychological Statistics-II & SPSS / মনস্তাত্ত্বিক পরিসংখ্যান-২", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "২য় বর্ষ (পর্ব-২)",
        semesterNameEn: "2nd Year (Part 2)",
        courses: [
          { id: "nu-psy-204", code: "223406", name: "Psychology Practical-II / মনোবিজ্ঞান ব্যবহারিক-২", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-psy-205", code: "221909", name: "Govt & Politics in Bangladesh / বাংলাদেশের সরকার ও রাজনীতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-psy-206", code: "222009", name: "Sociology of Bangladesh / বাংলাদেশের সমাজবিজ্ঞান", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৩য় বর্ষ (পর্ব-১)",
        semesterNameEn: "3rd Year (Part 1)",
        courses: [
          { id: "nu-psy-301", code: "233401", name: "Biopsychology & Neuroanatomy / শারীরবৃত্তীয় মনোবিজ্ঞান ও স্নায়ুবিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-psy-302", code: "233403", name: "Abnormal Psychology / অস্বাভাবিক মনোবিজ্ঞান (মানসিক ব্যাধি)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-psy-303", code: "233405", name: "Psychological Testing & Assessment / মনস্তাত্ত্বিক পরিমাপ ও অভীক্ষা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-psy-304", code: "233407", name: "Cognitive Psychology (Memory & Thinking) / জ্ঞানীয় মনোবিজ্ঞান (স্মৃতি ও চিন্তা)", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৩য় বর্ষ (পর্ব-২)",
        semesterNameEn: "3rd Year (Part 2)",
        courses: [
          { id: "nu-psy-305", code: "233409", name: "Industrial & Organizational Psychology / শিল্প ও সাংগঠনিক মনোবিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-psy-306", code: "233411", name: "Educational Psychology / শিক্ষা মনোবিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-psy-307", code: "233413", name: "Research Methodology in Psychology / মনোবিজ্ঞানে গবেষণা পদ্ধতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-psy-308", code: "233414", name: "Psychology Practical-III / মনোবিজ্ঞান ব্যবহারিক-৩", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-১)",
        semesterNameEn: "4th Year (Part 1)",
        courses: [
          { id: "nu-psy-401", code: "243401", name: "Clinical Psychology & Psychotherapy / ক্লিনিক্যাল সাইকোলজি ও কাউন্সেলিং", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-psy-402", code: "243403", name: "Counseling Psychology & Crisis Intervention / কাউন্সেলিং মনোবিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-psy-403", code: "243405", name: "Health Psychology & Stress Management / স্বাস্থ্য মনোবিজ্ঞান ও স্ট্রেস ম্যানেজমেন্ট", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-psy-404", code: "243407", name: "Positive Psychology & Well-being / ইতিবাচক মনোবিজ্ঞান ও মানসিক সুখ", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-২)",
        semesterNameEn: "4th Year (Part 2)",
        courses: [
          { id: "nu-psy-405", code: "243409", name: "Forensic and Criminal Psychology / ফরেনসিক ও অপরাধ মনোবিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-psy-406", code: "243411", name: "Child Psychopathology & Special Education / শিশু মনোপ্যাথলজি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-psy-407", code: "243414", name: "Advanced Psychological Assessment Practical / ব্যবহারিক কেস স্টাডি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-psy-408", code: "243418", name: "Comprehensive Viva-Voce / মৌখিক পরীক্ষা ও ইন্টার্নশিপ", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // NU 16. Statistics (পরিসংখ্যান)
  nu_statistics: {
    key: "nu_statistics",
    category: "NU",
    categoryLabelBn: "জাতীয় বিশ্ববিদ্যালয় অনার্স (NU Honours)",
    titleBn: "পরিসংখ্যান — বিএসসি (অনার্স) · জাতীয় বিশ্ববিদ্যালয় / রাজশাহী কলেজ",
    titleEn: "B.Sc. (Hons) in Statistics (National University Framework)",
    typicalTotalCredits: 128,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম বর্ষ (পর্ব-১)",
        semesterNameEn: "1st Year (Part 1)",
        courses: [
          { id: "nu-stat-101", code: "213601", name: "Descriptive Statistics / বর্ণনামূলক পরিসংখ্যান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-stat-102", code: "213603", name: "Probability and Probability Distributions / সম্ভাবনা ও সম্ভাবনা বিন্যাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-stat-103", code: "213605", name: "Practical: Descriptive Statistics / বর্ণনামূলক পরিসংখ্যান ব্যবহারিক", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "১ম বর্ষ (পর্ব-২)",
        semesterNameEn: "1st Year (Part 2)",
        courses: [
          { id: "nu-stat-104", code: "213607", name: "Mathematics-I (Calculus & Linear Algebra) / গণিত-১ (ক্যালকুলাস ও বীজগণিত)", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-stat-105", code: "211501", name: "History of Emergence of Independent BD / স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-stat-106", code: "212209", name: "Economics for Statistics / অর্থনীতি", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "২য় বর্ষ (পর্ব-১)",
        semesterNameEn: "2nd Year (Part 1)",
        courses: [
          { id: "nu-stat-201", code: "223601", name: "Sampling Distributions & Point Estimation / নমুনায়ন বিন্যাস ও বিন্দু প্রাক্কলন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-stat-202", code: "223603", name: "Hypothesis Testing & Confidence Intervals / অনুমান যাচাই ও আস্থা ব্যবধি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-stat-203", code: "223605", name: "Demography and Vital Statistics / জনমিতি ও জীবন পরিসংখ্যান", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "২য় বর্ষ (পর্ব-২)",
        semesterNameEn: "2nd Year (Part 2)",
        courses: [
          { id: "nu-stat-204", code: "223606", name: "Practical: Statistical Inference & R Lab / পরিসংখ্যানিক অনুমান ও R ল্যাব", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-stat-205", code: "223707", name: "Mathematics-II for Statistics / গণিত-২", credits: 4.0, gradePoint: 3.5 },
          { id: "nu-stat-206", code: "222209", name: "Macroeconomics / সামষ্টিক অর্থনীতি", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৩য় বর্ষ (পর্ব-১)",
        semesterNameEn: "3rd Year (Part 1)",
        courses: [
          { id: "nu-stat-301", code: "233601", name: "Regression Analysis & Correlation / নির্ভরণ বিশ্লেষণ ও সংশ্লেষ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-stat-302", code: "233603", name: "Design and Analysis of Experiments / পরীক্ষণ পরিকল্পনা ও বিশ্লেষণ (ANOVA)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-stat-303", code: "233605", name: "Sampling Techniques and Survey Design / নমুনায়ন পদ্ধতি ও জরিপ নকশা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-stat-304", code: "233607", name: "Time Series Analysis & Forecasting / কালীন সারি বিশ্লেষণ ও পূর্বাভাস", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৩য় বর্ষ (পর্ব-২)",
        semesterNameEn: "3rd Year (Part 2)",
        courses: [
          { id: "nu-stat-305", code: "233609", name: "Multivariate Analysis / বহুচলক বিশ্লেষণ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-stat-306", code: "233611", name: "Non-Parametric & Robust Methods / অপ্যারামেট্রিক পরিসংখ্যান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-stat-307", code: "233613", name: "Statistical Quality Control & Reliability / মান নিয়ন্ত্রণ ও নির্ভরযোগ্যতা", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-stat-308", code: "233614", name: "Practical: Advanced Statistical Computing (R/Python) / আর ও পাইথন ল্যাব", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-১)",
        semesterNameEn: "4th Year (Part 1)",
        courses: [
          { id: "nu-stat-401", code: "243601", name: "Econometric Modeling and Forecasting / অর্থনীতিমিতি মডেলিং", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-stat-402", code: "243603", name: "Biostatistics and Clinical Trials / জীবপরিসংখ্যান ও ক্লিনিক্যাল ট্রায়াল", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-stat-403", code: "243605", name: "Stochastic Processes & Queueing Theory / সম্ভাবনা প্রক্রিয়া", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-stat-404", code: "243607", name: "Data Science and Machine Learning with Python / মেশিন লার্নিং ও ডেটা সায়েন্স", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-২)",
        semesterNameEn: "4th Year (Part 2)",
        courses: [
          { id: "nu-stat-405", code: "243609", name: "Operations Research and Optimization / অপারেশন্স রিসার্চ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-stat-406", code: "243611", name: "Bayesian Statistics & Simulation / বায়েসিয়ান পরিসংখ্যান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-stat-407", code: "243614", name: "Practical: Data Science Capstone Project / ডেটা সায়েন্স ক্যাপস্টোন প্রজেক্ট", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-stat-408", code: "243618", name: "Comprehensive Viva-Voce / মৌখিক পরীক্ষা ও থিসিস", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // NU 17. Bangla (বাংলা)
  nu_bangla: {
    key: "nu_bangla",
    category: "NU",
    categoryLabelBn: "জাতীয় বিশ্ববিদ্যালয় অনার্স (NU Honours)",
    titleBn: "বাংলা ভাষা ও সাহিত্য — বিএ (অনার্স) · জাতীয় বিশ্ববিদ্যালয় / রাজশাহী কলেজ",
    titleEn: "B.A. (Hons) in Bengali Language & Literature (National University Framework)",
    typicalTotalCredits: 124,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম বর্ষ (পর্ব-১)",
        semesterNameEn: "1st Year (Part 1)",
        courses: [
          { id: "nu-bn-101", code: "211001", name: "History of Bengali Literature (Ancient & Medieval) / বাংলা সাহিত্যের ইতিহাস (প্রাচীন ও মধ্যযুগ)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bn-102", code: "211003", name: "Ancient & Medieval Poetry: Charyapada, Vaishnava / প্রাচীন ও মধ্যযুগের কবিতা: চর্যাপদ ও বৈষ্ণব পদাবলী", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bn-103", code: "211005", name: "Bengali Novel-I: Bankimchandra & Rabindranath / বাংলা উপন্যাস-১", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "১ম বর্ষ (পর্ব-২)",
        semesterNameEn: "1st Year (Part 2)",
        courses: [
          { id: "nu-bn-104", code: "211007", name: "History of the Emergence of Independent BD / স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bn-105", code: "211509", name: "History of Ancient Bengal / প্রাচীন বাংলার ইতিহাস", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-bn-106", code: "212009", name: "Principles of Sociology / সমাজবিজ্ঞানের মূলনীতি", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "২য় বর্ষ (পর্ব-১)",
        semesterNameEn: "2nd Year (Part 1)",
        courses: [
          { id: "nu-bn-201", code: "221001", name: "History of Bengali Literature (1800 to 1947) / বাংলা সাহিত্যের ইতিহাস (আধুনিক যুগ)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bn-202", code: "221003", name: "Modern Bengali Poetry: Madhusudan, Nabinchandra / আধুনিক বাংলা কবিতা (মেঘনাদবধ কাব্য)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bn-203", code: "221005", name: "Bengali Drama: Dinabandhu Mitra, D.L. Roy / বাংলা নাটক (নীলদর্পণ ও সাজাহান)", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "২য় বর্ষ (পর্ব-২)",
        semesterNameEn: "2nd Year (Part 2)",
        courses: [
          { id: "nu-bn-204", code: "221007", name: "Bengali Short Stories: Rabindranath to Manik / বাংলা ছোটগল্প", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bn-205", code: "221509", name: "History of Bengal (Medieval to Modern) / বাংলার ইতিহাস", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-bn-206", code: "221909", name: "Bangladesh Government & Politics / বাংলাদেশের সরকার ও রাজনীতি", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৩য় বর্ষ (পর্ব-১)",
        semesterNameEn: "3rd Year (Part 1)",
        courses: [
          { id: "nu-bn-301", code: "231001", name: "Rabindranath Tagore: Poetry, Prose & Art / রবীন্দ্র সাহিত্য (সোনার তরী ও রক্তকরবী)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bn-302", code: "231003", name: "Kazi Nazrul Islam: Rebel Poetry & Music / নজরুল সাহিত্য (অগ্নিবীণা ও বিষের বাঁশী)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bn-303", code: "231005", name: "Bengali Linguistics & Phonetics / বাংলা ভাষাতত্ত্ব ও ধ্বনিবিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bn-304", code: "231007", name: "Literary Criticism & Aesthetics (Rasa Theory) / সাহিত্যতত্ত্ব ও রসশাস্ত্র", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৩য় বর্ষ (পর্ব-২)",
        semesterNameEn: "3rd Year (Part 2)",
        courses: [
          { id: "nu-bn-305", code: "231009", name: "Modern Bengali Poetry (Post-30s: Jibanananda, Shamsur Rahman) / তিরিশোত্তর আধুনিক বাংলা কবিতা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bn-306", code: "231011", name: "Bengali Novel-II: Tarasankar, Bibhutibhushan / আধুনিক বাংলা উপন্যাস-২ (পথের পাঁচালী ও হাসুলী বাঁক)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bn-307", code: "231013", name: "Bengali Essay & Prose Literature / বাংলা প্রবন্ধ ও মননশীল সাহিত্য", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-bn-308", code: "231015", name: "Folk Literature & Culture of Bengal / বাংলা লোকসাহিত্য ও সংস্কৃতি", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-১)",
        semesterNameEn: "4th Year (Part 1)",
        courses: [
          { id: "nu-bn-401", code: "241001", name: "Literature of Bangladesh (1947 to date) / বাংলাদেশের সাহিত্য (ভাষা আন্দোলন ও মুক্তিযুদ্ধ)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bn-402", code: "241003", name: "War of Liberation Literature in BD / মুক্তিযুদ্ধভিত্তিক সাহিত্য (উপন্যাস, নাটক ও স্মৃতিকথা)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bn-403", code: "241005", name: "Modern Drama of Bangladesh: Selim Al Deen, Sayeed Ahmad / বাংলাদেশের আধুনিক নাটক (কিত্তনখোলা ও চাকা)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bn-404", code: "241007", name: "Western Literary Theories: Structuralism, Post-Modernism / পাশ্চাত্য সাহিত্যতত্ত্ব", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-২)",
        semesterNameEn: "4th Year (Part 2)",
        courses: [
          { id: "nu-bn-405", code: "241009", name: "Comparative Literature & World Masterpieces / তুলনামূলক সাহিত্য", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bn-406", code: "241011", name: "Practical Bangla: Editing, Translation & Proofreading / ব্যবহারিক বাংলা: সম্পাদনা ও অনুবাদ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bn-407", code: "241013", name: "Research Methodology in Bengali / বাংলা সাহিত্যে গবেষণা পদ্ধতি ও অভিসন্দর্ভ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-bn-408", code: "241018", name: "Comprehensive Viva-Voce / মৌখিক পরীক্ষা", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // NU 18. English (ইংরেজি)
  nu_english: {
    key: "nu_english",
    category: "NU",
    categoryLabelBn: "জাতীয় বিশ্ববিদ্যালয় অনার্স (NU Honours)",
    titleBn: "ইংরেজি ভাষা ও সাহিত্য — বিএ (অনার্স) · জাতীয় বিশ্ববিদ্যালয় / রাজশাহী কলেজ",
    titleEn: "B.A. (Hons) in English (National University Framework)",
    typicalTotalCredits: 124,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম বর্ষ (পর্ব-১)",
        semesterNameEn: "1st Year (Part 1)",
        courses: [
          { id: "nu-eng-101", code: "211101", name: "English Reading & Speaking Skills / ইংরেজি পঠন ও কথন দক্ষতা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-eng-102", code: "211103", name: "English Writing Skills / ইংরেজি লিখন কৌশল", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-eng-103", code: "211105", name: "Introduction to Poetry / ইংরেজি কবিতার ভূমিকা", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "১ম বর্ষ (পর্ব-২)",
        semesterNameEn: "1st Year (Part 2)",
        courses: [
          { id: "nu-eng-104", code: "211107", name: "Introduction to Prose (Fiction & Non-fiction) / ইংরেজি গদ্য ও কথাসাহিত্য", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-eng-105", code: "211501", name: "History of Emergence of Independent BD / স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-eng-106", code: "212009", name: "Principles of Sociology / সমাজবিজ্ঞানের মূলনীতি", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "২য় বর্ষ (পর্ব-১)",
        semesterNameEn: "2nd Year (Part 1)",
        courses: [
          { id: "nu-eng-201", code: "221101", name: "Introduction to Drama (Sophocles, Shakespeare, Shaw) / ইংরেজি নাটকের ভূমিকা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-eng-202", code: "221103", name: "Romantic Poetry: Wordsworth, Coleridge, Keats, Shelley / রোমান্টিক যুগের কবিতা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-eng-203", code: "221105", name: "17th & 18th Century Non-Fictional Prose / সপ্তদশ ও অষ্টাদশ শতাব্দীর গদ্য", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "২য় বর্ষ (পর্ব-২)",
        semesterNameEn: "2nd Year (Part 2)",
        courses: [
          { id: "nu-eng-204", code: "221107", name: "History of English Literature / ইংরেজি সাহিত্যের ধারাবাহিক ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-eng-205", code: "221909", name: "Bangladesh Government & Politics / বাংলাদেশের সরকার ও রাজনীতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-eng-206", code: "222009", name: "Sociology of Bangladesh / বাংলাদেশের সমাজবিজ্ঞান", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৩য় বর্ষ (পর্ব-১)",
        semesterNameEn: "3rd Year (Part 1)",
        courses: [
          { id: "nu-eng-301", code: "231101", name: "16th & 17th Century Poetry: Spenser, Donne, Milton / ষোড়শ ও সপ্তদশ শতকের কবিতা (প্যারাডাইস লস্ট)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-eng-302", code: "231103", name: "16th & 17th Century Drama: Marlowe, Shakespeare / রেনেসাঁ নাটক (হ্যামলেট ও ডক্টর ফস্টাস)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-eng-303", code: "231105", name: "18th Century Literature: Pope, Swift, Defoe / অষ্টাদশ শতকের ব্যঙ্গ সাহিত্য", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-eng-304", code: "231107", name: "Victorian Poetry: Tennyson, Browning, Arnold / ভিক্টোরিয়ান কবিতা", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৩য় বর্ষ (পর্ব-২)",
        semesterNameEn: "3rd Year (Part 2)",
        courses: [
          { id: "nu-eng-305", code: "231109", name: "Introduction to Linguistics / ভাষাতত্ত্বের ভূমিকা ও ধ্বনিবিজ্ঞান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-eng-306", code: "231111", name: "Victorian Novel: Dickens, Bronte, Hardy / ভিক্টোরিয়ান উপন্যাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-eng-307", code: "231113", name: "Introduction to Literary Criticism (Aristotle to Arnold) / সাহিত্য সমালোচনার ভূমিকা", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-eng-308", code: "231115", name: "American Literature: Fiction & Drama / আমেরিকান সাহিত্য", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-১)",
        semesterNameEn: "4th Year (Part 1)",
        courses: [
          { id: "nu-eng-401", code: "241101", name: "20th Century Poetry: Yeats, Eliot, Auden / বিংশ শতাব্দীর কবিতা (দ্য ওয়েস্ট ল্যান্ড)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-eng-402", code: "241103", name: "20th Century Drama: Beckett, Osborne, Pinter / বিংশ শতাব্দীর আধুনিক নাটক (ওয়েটিং ফর গোডো)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-eng-403", code: "241105", name: "20th Century Novel: Conrad, Lawrence, Woolf / বিংশ শতাব্দীর উপন্যাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-eng-404", code: "241107", name: "Modern Critical Theory: Feminism, Postcolonialism / আধুনিক সমালোচনাতত্ত্ব", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-২)",
        semesterNameEn: "4th Year (Part 2)",
        courses: [
          { id: "nu-eng-405", code: "241109", name: "Classics in Translation: Homer, Virgil, Dostoevsky / অনূদিত বিশ্বসাহিত্য", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-eng-406", code: "241111", name: "ELT (English Language Teaching) & Applied Linguistics / ইংরেজি ভাষা শিক্ষণ পদ্ধতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-eng-407", code: "241113", name: "Postcolonial Literature in English: Achebe, Walcott / উত্তর-উপনিবেশিক সাহিত্য", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-eng-408", code: "241118", name: "Comprehensive Viva-Voce / মৌখিক পরীক্ষা ও টার্ম পেপার", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // NU 19. History (ইতিহাস)
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

  // NU 20. Islamic History & Culture (ইসলামের ইতিহাস ও সংস্কৃতি)
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

  // NU 21. Philosophy (দর্শন)
  nu_philosophy: {
    key: "nu_philosophy",
    category: "NU",
    categoryLabelBn: "জাতীয় বিশ্ববিদ্যালয় অনার্স (NU Honours)",
    titleBn: "দর্শন — বিএ (অনার্স) · জাতীয় বিশ্ববিদ্যালয় / রাজশাহী কলেজ",
    titleEn: "B.A. (Hons) in Philosophy (National University Framework)",
    typicalTotalCredits: 124,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম বর্ষ (পর্ব-১)",
        semesterNameEn: "1st Year (Part 1)",
        courses: [
          { id: "nu-phil-101", code: "211701", name: "Introduction to Philosophy / দর্শন পরিচিতি ও মূল প্রত্যয়", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phil-102", code: "211703", name: "General Logic: Deductive & Inductive / সাধারণ যুক্তিবিদ্যা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phil-103", code: "211705", name: "History of Western Philosophy (Greek & Medieval) / পাশ্চাত্য দর্শনের ইতিহাস: গ্রিক ও মধ্যযুগ", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "১ম বর্ষ (পর্ব-২)",
        semesterNameEn: "1st Year (Part 2)",
        courses: [
          { id: "nu-phil-104", code: "211707", name: "Psychology for Philosophy / মনোবিজ্ঞান পরিচিতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-phil-105", code: "211501", name: "History of Emergence of Independent BD / স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phil-106", code: "211909", name: "Principles of Political Science / রাষ্ট্রবিজ্ঞানের মূলনীতি", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "২য় বর্ষ (পর্ব-১)",
        semesterNameEn: "2nd Year (Part 1)",
        courses: [
          { id: "nu-phil-201", code: "221701", name: "History of Modern Western Philosophy / আধুনিক পাশ্চাত্য দর্শনের ইতিহাস (বেকন থেকে কান্ট)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phil-202", code: "221703", name: "Symbolic Logic / প্রতীকি যুক্তিবিদ্যা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phil-203", code: "221705", name: "General Ethics and Moral Theory / সাধারণ নীতিবিদ্যা", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "২য় বর্ষ (পর্ব-২)",
        semesterNameEn: "2nd Year (Part 2)",
        courses: [
          { id: "nu-phil-204", code: "221707", name: "Indian Philosophy (Charvaka, Buddhism, Vedanta) / ভারতীয় দর্শন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phil-205", code: "221909", name: "Government and Politics in BD / বাংলাদেশের সরকার ও রাজনীতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-phil-206", code: "222009", name: "Sociology of Bangladesh / বাংলাদেশের সমাজবিজ্ঞান", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৩য় বর্ষ (পর্ব-১)",
        semesterNameEn: "3rd Year (Part 1)",
        courses: [
          { id: "nu-phil-301", code: "231701", name: "Epistemology (Theories of Knowledge) / জ্ঞানবিদ্যা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phil-302", code: "231703", name: "Metaphysics (Ontology & Substance) / পরাবিদ্যা ও সত্তাতত্ত্ব", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phil-303", code: "231705", name: "Muslim Philosophy: Mutazila, Asharite, Ibn Sina / মুসলিম দর্শন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phil-304", code: "231707", name: "Philosophy of Religion / ধর্মদর্শন", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৩য় বর্ষ (পর্ব-২)",
        semesterNameEn: "3rd Year (Part 2)",
        courses: [
          { id: "nu-phil-305", code: "231709", name: "Social and Political Philosophy / সামাজিক ও রাজনৈতিক দর্শন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phil-306", code: "231711", name: "Applied Ethics (Bioethics & Environmental) / ফলিত নীতিবিদ্যা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phil-307", code: "231713", name: "Bangla Philosophy & Baul Thought / বাঙালির দর্শন ও বাউল মত", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-phil-308", code: "231715", name: "Philosophy of Art & Aesthetics / নন্দনতত্ত্ব", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-১)",
        semesterNameEn: "4th Year (Part 1)",
        courses: [
          { id: "nu-phil-401", code: "241701", name: "Contemporary Western Philosophy (Existentialism, Pragmatism) / সমকালীন পাশ্চাত্য দর্শন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phil-402", code: "241703", name: "Analytic Philosophy & Wittgenstein / বিশ্লেষণী দর্শন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phil-403", code: "241705", name: "Philosophy of Mind & Cognitive Science / মনদর্শন ও চৈতন্যতত্ত্ব", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phil-404", code: "241707", name: "Marxist and Post-Modern Philosophy / মার্কসীয় দর্শন ও উত্তরাধুনিকতাবাদ", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-২)",
        semesterNameEn: "4th Year (Part 2)",
        courses: [
          { id: "nu-phil-405", code: "241709", name: "Philosophy of Science / বিজ্ঞানদর্শন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phil-406", code: "241711", name: "Philosophy of Language / ভাষাদর্শন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phil-407", code: "241713", name: "Research Methodology in Philosophy / দর্শনে গবেষণা পদ্ধতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-phil-408", code: "241718", name: "Comprehensive Viva-Voce / মৌখিক পরীক্ষা ও মনোগ্রাফ", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // NU 22. Islamic Studies (ইসলামিক স্টাডিজ)
  nu_islamic_studies: {
    key: "nu_islamic_studies",
    category: "NU",
    categoryLabelBn: "জাতীয় বিশ্ববিদ্যালয় অনার্স (NU Honours)",
    titleBn: "ইসলামিক স্টাডিজ — বিএ (অনার্স) · জাতীয় বিশ্ববিদ্যালয় / রাজশাহী কলেজ",
    titleEn: "B.A. (Hons) in Islamic Studies (National University Framework)",
    typicalTotalCredits: 124,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম বর্ষ (পর্ব-১)",
        semesterNameEn: "1st Year (Part 1)",
        courses: [
          { id: "nu-is-101", code: "211801", name: "Al-Quran and Usul-al-Tafsir / আল-কুরআন ও তাফসিরের মূলনীতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-is-102", code: "211803", name: "Al-Hadith and Usul-al-Hadith / আল-হাদিস ও হাদিসের মূলনীতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-is-103", code: "211805", name: "Sirat-un-Nabi (PBUH) / সিরাতুন্নবী (সা.) ও ইসলামী দাওয়াত", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "১ম বর্ষ (পর্ব-২)",
        semesterNameEn: "1st Year (Part 2)",
        courses: [
          { id: "nu-is-104", code: "211807", name: "Arabic Language & Grammar-I / আরবি ভাষা ও ব্যাকরণ-১", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-is-105", code: "211501", name: "History of Emergence of Independent BD / স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-is-106", code: "211609", name: "History of the Muslims / মুসলিম ইতিহাস", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "২য় বর্ষ (পর্ব-১)",
        semesterNameEn: "2nd Year (Part 1)",
        courses: [
          { id: "nu-is-201", code: "221801", name: "Al-Fiqh and Usul-al-Fiqh (Jurisprudence) / আল-ফিকহ ও ইসলামী আইনশাস্ত্রের মূলনীতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-is-202", code: "221803", name: "Islamic Aqidah and Kalam / ইসলামী আকীদা ও ইলমুল কালাম", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-is-203", code: "221805", name: "Arabic Language & Translation-II / আরবি ভাষা ও অনুবাদ-২", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "২য় বর্ষ (পর্ব-২)",
        semesterNameEn: "2nd Year (Part 2)",
        courses: [
          { id: "nu-is-204", code: "221807", name: "Islamic Ethics and Morality (Akhlaq) / ইসলামী আখলাক ও নৈতিকতা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-is-205", code: "221909", name: "Bangladesh Govt & Politics / বাংলাদেশের সরকার ও রাজনীতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-is-206", code: "222009", name: "Sociology of Bangladesh / বাংলাদেশের সমাজবিজ্ঞান", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৩য় বর্ষ (পর্ব-১)",
        semesterNameEn: "3rd Year (Part 1)",
        courses: [
          { id: "nu-is-301", code: "231801", name: "Textual Study of Al-Quran (Surah Baqarah, Nur) / নির্বাচিত কুরআনি পাঠ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-is-302", code: "231803", name: "Textual Study of Sahih Bukhari & Muslim / হাদিস পাঠ (বুখারী ও মুসলিম)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-is-303", code: "231805", name: "Islamic Economic System & Banking / ইসলামী অর্থব্যবস্থা ও যাকাত-সদকা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-is-304", code: "231807", name: "Islamic Political System & Governance / ইসলামী রাষ্ট্রব্যবস্থা ও খিলাফত", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৩য় বর্ষ (পর্ব-২)",
        semesterNameEn: "3rd Year (Part 2)",
        courses: [
          { id: "nu-is-305", code: "231809", name: "Islamic Family Law & Inheritance (Mirath) / ইসলামী পারিবারিক আইন ও উত্তরাধিকার", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-is-306", code: "231811", name: "Comparative Religion (Judaism, Christianity, Hinduism) / তুলনামূলক ধর্মতত্ত্ব", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-is-307", code: "231813", name: "Sufism and Tazkiyah / তাসাউফ ও আত্মশুদ্ধি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-is-308", code: "231815", name: "Human Rights in Islam / ইসলামে মানবাধিকার ও আন্তর্জাতিক আইন", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-১)",
        semesterNameEn: "4th Year (Part 1)",
        courses: [
          { id: "nu-is-401", code: "241801", name: "Contemporary Islamic Thought & Modernity / সমকালীন ইসলামী চিন্তা ও আধুনিকতা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-is-402", code: "241803", name: "Philosophy of Islamic Law (Maqasid al-Shariah) / মাকাসিদুশ শরীয়াহ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-is-403", code: "241805", name: "Islam in Bengal: Da'wah & Social Impact / বাংলায় ইসলাম ও ওলি-আউলিয়াদের অবদান", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-is-404", code: "241807", name: "Modern Bioethics and Islamic Fiqh / আধুনিক চিকিৎসা ও বায়োএথিক্সে ফিকহ", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-২)",
        semesterNameEn: "4th Year (Part 2)",
        courses: [
          { id: "nu-is-405", code: "241809", name: "Islamic Education System & Institutions / ইসলামী শিক্ষাব্যবস্থা ও মাদ্রাসা ঐতিহ্য", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-is-406", code: "241811", name: "Da'wah Methodology & Media Technology / দাওয়াত পদ্ধতি ও আধুনিক মিডিয়া", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-is-407", code: "241813", name: "Research Methodology in Islamic Studies / ইসলামী গবেষণার নীতিপদ্ধতি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-is-408", code: "241818", name: "Comprehensive Viva-Voce / মৌখিক পরীক্ষা ও মনোগ্রাফ", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // NU 23. Arabic (আরবি)
  nu_arabic: {
    key: "nu_arabic",
    category: "NU",
    categoryLabelBn: "জাতীয় বিশ্ববিদ্যালয় অনার্স (NU Honours)",
    titleBn: "আরবি ভাষা ও সাহিত্য — বিএ (অনার্স) · জাতীয় বিশ্ববিদ্যালয় / রাজশাহী কলেজ",
    titleEn: "B.A. (Hons) in Arabic Language & Literature (National University Framework)",
    typicalTotalCredits: 124,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম বর্ষ (পর্ব-১)",
        semesterNameEn: "1st Year (Part 1)",
        courses: [
          { id: "nu-ar-101", code: "211201", name: "Arabic Grammar: Nahw and Sarf-I / আরবি ব্যাকরণ: নাহু ও সরফ-১", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ar-102", code: "211203", name: "Classical Arabic Prose & Quranic Texts / ধ্রুপদী আরবি গদ্য ও কুরআনি পাঠ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ar-103", code: "211205", name: "Pre-Islamic & Early Islamic Poetry / প্রাক-ইসলামী ও ইসলামি যুগের কবিতা", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "১ম বর্ষ (পর্ব-২)",
        semesterNameEn: "1st Year (Part 2)",
        courses: [
          { id: "nu-ar-104", code: "211207", name: "Spoken Arabic & Conversation Practice / কথ্য আরবি ও কথোপকথন অনুশীলন", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ar-105", code: "211501", name: "History of Emergence of Independent BD / স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ar-106", code: "211609", name: "History of the Muslims / মুসলিম ইতিহাস", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "২য় বর্ষ (পর্ব-১)",
        semesterNameEn: "2nd Year (Part 1)",
        courses: [
          { id: "nu-ar-201", code: "221201", name: "Arabic Grammar: Advanced Nahw & Sarf-II / উচ্চতর নাহু ও সরফ-২", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ar-202", code: "221203", name: "Umayyad and Abbasid Poetry / উমাইয়া ও আব্বাসীয় কবিতা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ar-203", code: "221205", name: "Arabic Rhetoric: Balaghah & Prosody / আরবি অলংকারশাস্ত্র (বালাগাত ও আরুজ)", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "২য় বর্ষ (পর্ব-২)",
        semesterNameEn: "2nd Year (Part 2)",
        courses: [
          { id: "nu-ar-204", code: "221207", name: "History of Arabic Literature (Pre-Islamic to Abbasid) / আরবি সাহিত্যের ইতিহাস", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ar-205", code: "221909", name: "Government and Politics in BD / বাংলাদেশের সরকার ও রাজনীতি", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-ar-206", code: "222009", name: "Sociology of Bangladesh / বাংলাদেশের সমাজবিজ্ঞান", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৩য় বর্ষ (পর্ব-১)",
        semesterNameEn: "3rd Year (Part 1)",
        courses: [
          { id: "nu-ar-301", code: "231201", name: "Andalusian Arabic Literature (Poetry & Muwashshah) / স্পেনের আরবি সাহিত্য", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ar-302", code: "231203", name: "Modern Arabic Poetry: Shawqi, Hafiz, Mutran / আধুনিক আরবি কবিতা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ar-303", code: "231205", name: "Modern Arabic Fiction: Naguib Mahfouz & Taha Hussein / আধুনিক আরবি উপন্যাস ও ছোটগল্প", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ar-304", code: "231207", name: "Arabic Translation: Legal, Commercial & Media / আরবি অনুবাদ শিল্প", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৩য় বর্ষ (পর্ব-২)",
        semesterNameEn: "3rd Year (Part 2)",
        courses: [
          { id: "nu-ar-305", code: "231209", name: "Arabic Linguistics & Lexicography / আরবি ভাষাতত্ত্ব ও অভিধানতত্ত্ব", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ar-306", code: "231211", name: "Modern Arabic Drama: Tawfiq al-Hakim / আধুনিক আরবি নাটক", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ar-307", code: "231213", name: "History of Modern Arabic Literature / আধুনিক আরবি সাহিত্যের ইতিহাস", credits: 4.0, gradePoint: 3.75 },
          { id: "nu-ar-308", code: "231215", name: "Arabic Literary Criticism (Classic & Modern) / আরবি সাহিত্য সমালোচনা", credits: 4.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-১)",
        semesterNameEn: "4th Year (Part 1)",
        courses: [
          { id: "nu-ar-401", code: "241201", name: "Arabic Literature in Bangladesh & Subcontinent / উপমহাদেশে আরবি সাহিত্য চর্চা", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ar-402", code: "241203", name: "Mahjar (Emigrant) Literature: Kahlil Gibran, Nu'ayma / মাহজার সাহিত্য (খলিল জিবরান)", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ar-403", code: "241205", name: "Media Arabic and Diplomatic Correspondence / কূটনৈতিক ও সংবাদপত্রের আরবি", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ar-404", code: "241207", name: "Comparative Semitic Languages / তুলনামূলক সেমিটিক ভাষাতত্ত্ব", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৪র্থ বর্ষ (পর্ব-২)",
        semesterNameEn: "4th Year (Part 2)",
        courses: [
          { id: "nu-ar-405", code: "241209", name: "Simultaneous Interpretation (Arabic-English-Bangla) / তাৎক্ষণিক দোভাষী অনুবাদ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ar-406", code: "241211", name: "Literary Translation of World Masterpieces into Arabic / আরবি বিশ্বসাহিত্য অনুবাদ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ar-407", code: "241213", name: "Research Methodology in Arabic / আরবিতে গবেষণা পদ্ধতি ও মনোগ্রাফ", credits: 4.0, gradePoint: 4.0 },
          { id: "nu-ar-408", code: "241218", name: "Comprehensive Viva-Voce / মৌখিক পরীক্ষা", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },
"""

# Find closing of DEGREE_PROGRAMS
anchor = "  },\n\n};"
if anchor in content:
    idx = content.rfind(anchor)
    content = content[:idx+4] + "\n" + NU_DEPARTMENTS + content[idx+4:]
elif "};\n\n/* ==" in content:
    idx = content.find("};\n\n/* ==")
    content = content[:idx] + "\n" + NU_DEPARTMENTS + content[idx:]
else:
    print("Error: Could not locate DEGREE_PROGRAMS closing anchor in file!")
    sys.exit(1)

with open(ENGINE_FILE, "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully injected all 23 National University & Rajshahi College Honours Departments into cgpa-grade-engine.ts!")
