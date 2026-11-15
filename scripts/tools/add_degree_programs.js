import fs from 'fs';

const filePath = 'src/lib/education/cgpa-grade-engine.ts';
let content = fs.readFileSync(filePath, 'utf8');

const newPrograms = `
  // 5. BSC in EEE
  bsc_eee: {
    key: "bsc_eee",
    category: "BSC",
    categoryLabelBn: "বিএসসি ইঞ্জিনিয়ারিং (B.Sc. Engineering)",
    titleBn: "বিএসসি ইন ইলেকট্রিক্যাল অ্যান্ড ইলেকট্রনিক ইঞ্জিনিয়ারিং (EEE)",
    titleEn: "B.Sc. in Electrical & Electronic Engineering (UGC Standard)",
    typicalTotalCredits: 144,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম সেমিস্টার (১ম বর্ষ)",
        semesterNameEn: "1st Semester (Year 1)",
        courses: [
          { id: "eee-101", code: "EEE-1101", name: "Electrical Circuits-I", credits: 3.0, gradePoint: 4.0 },
          { id: "eee-102", code: "EEE-1102", name: "Electrical Circuits-I Lab", credits: 1.5, gradePoint: 4.0 },
          { id: "eee-103", code: "PHY-1101", name: "Engineering Physics-I (Optics & Waves)", credits: 3.0, gradePoint: 3.75 },
          { id: "eee-104", code: "MATH-1101", name: "Differential & Integral Calculus", credits: 3.0, gradePoint: 3.75 },
          { id: "eee-105", code: "ENG-1101", name: "English Language & Communication", credits: 3.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "২য় সেমিস্টার (১ম বর্ষ)",
        semesterNameEn: "2nd Semester (Year 1)",
        courses: [
          { id: "eee-201", code: "EEE-1201", name: "Electrical Circuits-II", credits: 3.0, gradePoint: 4.0 },
          { id: "eee-202", code: "EEE-1202", name: "Electrical Circuits-II Lab", credits: 1.5, gradePoint: 4.0 },
          { id: "eee-203", code: "CSE-1201", name: "Computer Programming (C/C++)", credits: 3.0, gradePoint: 4.0 },
          { id: "eee-204", code: "CSE-1202", name: "Computer Programming Lab", credits: 1.5, gradePoint: 4.0 },
          { id: "eee-205", code: "MATH-1201", name: "Coordinate Geometry & Linear Algebra", credits: 3.0, gradePoint: 3.75 },
          { id: "eee-206", code: "PHY-1201", name: "Physics-II (Electromagnetism)", credits: 3.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "৩য় সেমিস্টার (২য় বর্ষ)",
        semesterNameEn: "3rd Semester (Year 2)",
        courses: [
          { id: "eee-301", code: "EEE-2101", name: "Analog Electronics-I", credits: 3.0, gradePoint: 4.0 },
          { id: "eee-302", code: "EEE-2102", name: "Analog Electronics-I Lab", credits: 1.5, gradePoint: 4.0 },
          { id: "eee-303", code: "EEE-2103", name: "Electrical Machines-I (Transformers & DC)", credits: 3.0, gradePoint: 3.75 },
          { id: "eee-304", code: "EEE-2104", name: "Electrical Machines-I Lab", credits: 1.5, gradePoint: 4.0 },
          { id: "eee-305", code: "MATH-2101", name: "Ordinary & Partial Differential Equations", credits: 3.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "৪র্থ সেমিস্টার (২য় বর্ষ)",
        semesterNameEn: "4th Semester (Year 2)",
        courses: [
          { id: "eee-401", code: "EEE-2201", name: "Analog Electronics-II", credits: 3.0, gradePoint: 4.0 },
          { id: "eee-402", code: "EEE-2202", name: "Analog Electronics-II Lab", credits: 1.5, gradePoint: 4.0 },
          { id: "eee-403", code: "EEE-2203", name: "Electrical Machines-II (Induction & Sync)", credits: 3.0, gradePoint: 3.75 },
          { id: "eee-404", code: "EEE-2205", name: "Electromagnetic Fields & Waves", credits: 3.0, gradePoint: 3.5 },
          { id: "eee-405", code: "STAT-2201", name: "Probability & Statistics for Engineers", credits: 3.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৫ম সেমিস্টার (৩য় বর্ষ)",
        semesterNameEn: "5th Semester (Year 3)",
        courses: [
          { id: "eee-501", code: "EEE-3101", name: "Signals & Linear Systems", credits: 3.0, gradePoint: 4.0 },
          { id: "eee-502", code: "EEE-3103", name: "Digital Logic Design & Digital Electronics", credits: 3.0, gradePoint: 4.0 },
          { id: "eee-503", code: "EEE-3104", name: "Digital Electronics Lab", credits: 1.5, gradePoint: 4.0 },
          { id: "eee-504", code: "EEE-3105", name: "Power System-I (Transmission & Distribution)", credits: 3.0, gradePoint: 3.75 },
          { id: "eee-505", code: "EEE-3106", name: "Power System-I Lab", credits: 1.5, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৬ষ্ঠ সেমিস্টার (৩য় বর্ষ)",
        semesterNameEn: "6th Semester (Year 3)",
        courses: [
          { id: "eee-601", code: "EEE-3201", name: "Microprocessors & Microcontrollers", credits: 3.0, gradePoint: 4.0 },
          { id: "eee-602", code: "EEE-3202", name: "Microprocessor Interfacing Lab", credits: 1.5, gradePoint: 4.0 },
          { id: "eee-603", code: "EEE-3203", name: "Digital & Analog Communication Engineering", credits: 3.0, gradePoint: 3.75 },
          { id: "eee-604", code: "EEE-3205", name: "Power Electronics & Industrial Drives", credits: 3.0, gradePoint: 4.0 },
          { id: "eee-605", code: "EEE-3206", name: "Power Electronics Lab", credits: 1.5, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৭ম সেমিস্টার (৪র্থ বর্ষ)",
        semesterNameEn: "7th Semester (Year 4)",
        courses: [
          { id: "eee-701", code: "EEE-4101", name: "Control System Engineering", credits: 3.0, gradePoint: 4.0 },
          { id: "eee-702", code: "EEE-4102", name: "Control System Lab", credits: 1.5, gradePoint: 4.0 },
          { id: "eee-703", code: "EEE-4103", name: "Power System Protection & Switchgear", credits: 3.0, gradePoint: 3.75 },
          { id: "eee-704", code: "EEE-4100", name: "Senior Capstone Design Project-I", credits: 2.0, gradePoint: 4.0 },
          { id: "eee-705", code: "EEE-4105", name: "Renewable Energy & Solar Grid Systems", credits: 3.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৮ম সেমিস্টার (৪র্থ বর্ষ)",
        semesterNameEn: "8th Semester (Year 4)",
        courses: [
          { id: "eee-801", code: "EEE-4201", name: "VLSI Circuit Design & Fabrication", credits: 3.0, gradePoint: 4.0 },
          { id: "eee-802", code: "EEE-4202", name: "VLSI Simulation Lab", credits: 1.5, gradePoint: 4.0 },
          { id: "eee-803", code: "EEE-4200", name: "Final Thesis & Capstone Project Defense", credits: 4.0, gradePoint: 4.0 },
          { id: "eee-804", code: "EEE-4299", name: "Industrial Attachment / Internship", credits: 3.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // 6. BSC in Civil Engineering
  bsc_civil: {
    key: "bsc_civil",
    category: "BSC",
    categoryLabelBn: "বিএসসি ইঞ্জিনিয়ারিং (B.Sc. Engineering)",
    titleBn: "বিএসসি ইন সিভিল ইঞ্জিনিয়ারিং (CE)",
    titleEn: "B.Sc. in Civil Engineering (UGC Standard)",
    typicalTotalCredits: 145,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম সেমিস্টার (১ম বর্ষ)",
        semesterNameEn: "1st Semester (Year 1)",
        courses: [
          { id: "ce-101", code: "CE-1101", name: "Engineering Mechanics (Statics)", credits: 3.0, gradePoint: 4.0 },
          { id: "ce-102", code: "CE-1102", name: "Civil Engineering Drawing Lab", credits: 1.5, gradePoint: 4.0 },
          { id: "ce-103", code: "MATH-1101", name: "Differential & Integral Calculus", credits: 3.0, gradePoint: 3.75 },
          { id: "ce-104", code: "PHY-1101", name: "Physics for Civil Engineers", credits: 3.0, gradePoint: 3.5 },
          { id: "ce-105", code: "ENG-1101", name: "Technical English Communication", credits: 3.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "২য় সেমিস্টার (১ম বর্ষ)",
        semesterNameEn: "2nd Semester (Year 1)",
        courses: [
          { id: "ce-201", code: "CE-1201", name: "Surveying & Leveling", credits: 3.0, gradePoint: 4.0 },
          { id: "ce-202", code: "CE-1202", name: "Survey Practical Fieldwork Lab", credits: 1.5, gradePoint: 4.0 },
          { id: "ce-203", code: "CHEM-1201", name: "Chemistry of Building Materials", credits: 3.0, gradePoint: 3.5 },
          { id: "ce-204", code: "MATH-1201", name: "Matrices & Solid Geometry", credits: 3.0, gradePoint: 3.75 },
          { id: "ce-205", code: "CSE-1201", name: "Computer Fundamentals & AutoCAD", credits: 3.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "৩য় সেমিস্টার (২য় বর্ষ)",
        semesterNameEn: "3rd Semester (Year 2)",
        courses: [
          { id: "ce-301", code: "CE-2101", name: "Mechanics of Solids-I", credits: 3.0, gradePoint: 4.0 },
          { id: "ce-302", code: "CE-2102", name: "Solid Mechanics Lab", credits: 1.5, gradePoint: 4.0 },
          { id: "ce-303", code: "CE-2103", name: "Fluid Mechanics", credits: 3.0, gradePoint: 3.75 },
          { id: "ce-304", code: "CE-2104", name: "Fluid Mechanics Lab", credits: 1.5, gradePoint: 4.0 },
          { id: "ce-305", code: "MATH-2101", name: "Differential Equations & Laplace Transform", credits: 3.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "৪র্থ সেমিস্টার (২য় বর্ষ)",
        semesterNameEn: "4th Semester (Year 2)",
        courses: [
          { id: "ce-401", code: "CE-2201", name: "Mechanics of Solids-II", credits: 3.0, gradePoint: 4.0 },
          { id: "ce-402", code: "CE-2203", name: "Structural Analysis-I", credits: 3.0, gradePoint: 3.75 },
          { id: "ce-403", code: "CE-2205", name: "Engineering Geology & Geotechnical Engineering", credits: 3.0, gradePoint: 3.5 },
          { id: "ce-404", code: "CE-2206", name: "Geotechnical Engineering Lab", credits: 1.5, gradePoint: 4.0 },
          { id: "ce-405", code: "STAT-2201", name: "Probability & Applied Statistics", credits: 3.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৫ম সেমিস্টার (৩য় বর্ষ)",
        semesterNameEn: "5th Semester (Year 3)",
        courses: [
          { id: "ce-501", code: "CE-3101", name: "Design of Concrete Structures-I (RCC)", credits: 3.0, gradePoint: 4.0 },
          { id: "ce-502", code: "CE-3102", name: "Concrete & Material Testing Lab", credits: 1.5, gradePoint: 4.0 },
          { id: "ce-503", code: "CE-3103", name: "Environmental Engineering-I (Water Supply)", credits: 3.0, gradePoint: 3.75 },
          { id: "ce-504", code: "CE-3105", name: "Transportation Engineering-I (Highways)", credits: 3.0, gradePoint: 3.75 },
          { id: "ce-505", code: "CE-3106", name: "Transportation Engineering Lab", credits: 1.5, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৬ষ্ঠ সেমিস্টার (৩য় বর্ষ)",
        semesterNameEn: "6th Semester (Year 3)",
        courses: [
          { id: "ce-601", code: "CE-3201", name: "Design of Concrete Structures-II", credits: 3.0, gradePoint: 4.0 },
          { id: "ce-602", code: "CE-3203", name: "Structural Analysis-II & Indeterminate Structures", credits: 3.0, gradePoint: 3.75 },
          { id: "ce-603", code: "CE-3205", name: "Environmental Engineering-II (Wastewater)", credits: 3.0, gradePoint: 4.0 },
          { id: "ce-604", code: "CE-3207", name: "Foundation Engineering & Soil Mechanics", credits: 3.0, gradePoint: 3.5 },
          { id: "ce-605", code: "CE-3208", name: "Foundation Design Sessional", credits: 1.5, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৭ম সেমিস্টার (৪র্থ বর্ষ)",
        semesterNameEn: "7th Semester (Year 4)",
        courses: [
          { id: "ce-701", code: "CE-4101", name: "Design of Steel Structures", credits: 3.0, gradePoint: 4.0 },
          { id: "ce-702", code: "CE-4103", name: "Irrigation & Flood Control Engineering", credits: 3.0, gradePoint: 3.75 },
          { id: "ce-703", code: "CE-4105", name: "Construction Management & Project Planning", credits: 3.0, gradePoint: 4.0 },
          { id: "ce-704", code: "CE-4100", name: "Senior Capstone Design Project-I", credits: 2.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৮ম সেমিস্টার (৪র্থ বর্ষ)",
        semesterNameEn: "8th Semester (Year 4)",
        courses: [
          { id: "ce-801", code: "CE-4201", name: "Earthquake Resistant Design & Retrofitting", credits: 3.0, gradePoint: 4.0 },
          { id: "ce-802", code: "CE-4203", name: "Bridge Engineering & GIS Applications", credits: 3.0, gradePoint: 3.75 },
          { id: "ce-803", code: "CE-4200", name: "Senior Thesis Defense & Capstone Phase-II", credits: 4.0, gradePoint: 4.0 },
          { id: "ce-804", code: "CE-4299", name: "Civil Engineering Field Internship", credits: 3.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // 7. BSC in Software Engineering
  bsc_swe: {
    key: "bsc_swe",
    category: "BSC",
    categoryLabelBn: "বিএসসি ইঞ্জিনিয়ারিং (B.Sc. Engineering)",
    titleBn: "বিএসসি ইন সফটওয়্যার ইঞ্জিনিয়ারিং (SWE)",
    titleEn: "B.Sc. in Software Engineering (UGC Standard)",
    typicalTotalCredits: 140,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম সেমিস্টার (১ম বর্ষ)",
        semesterNameEn: "1st Semester (Year 1)",
        courses: [
          { id: "swe-101", code: "SWE-1101", name: "Introduction to Software Engineering", credits: 3.0, gradePoint: 4.0 },
          { id: "swe-102", code: "SWE-1102", name: "Programming Fundamentals (Python/C)", credits: 3.0, gradePoint: 4.0 },
          { id: "swe-103", code: "SWE-1103", name: "Programming Fundamentals Lab", credits: 1.5, gradePoint: 4.0 },
          { id: "swe-104", code: "MATH-1101", name: "Discrete Mathematics for SWE", credits: 3.0, gradePoint: 3.75 },
          { id: "swe-105", code: "ENG-1101", name: "Technical Writing & Presentation", credits: 3.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "২য় সেমিস্টার (১ম বর্ষ)",
        semesterNameEn: "2nd Semester (Year 1)",
        courses: [
          { id: "swe-201", code: "SWE-1201", name: "Object Oriented Design (Java/TypeScript)", credits: 3.0, gradePoint: 4.0 },
          { id: "swe-202", code: "SWE-1202", name: "Object Oriented Design Lab", credits: 1.5, gradePoint: 4.0 },
          { id: "swe-203", code: "SWE-1203", name: "Data Structures & Algorithms", credits: 3.0, gradePoint: 4.0 },
          { id: "swe-204", code: "SWE-1204", name: "Data Structures Lab", credits: 1.5, gradePoint: 4.0 },
          { id: "swe-205", code: "MATH-1201", name: "Linear Algebra & Calculus", credits: 3.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "৩য় সেমিস্টার (২য় বর্ষ)",
        semesterNameEn: "3rd Semester (Year 2)",
        courses: [
          { id: "swe-301", code: "SWE-2101", name: "Software Requirements Engineering", credits: 3.0, gradePoint: 4.0 },
          { id: "swe-302", code: "SWE-2103", name: "Database Systems & Architecture", credits: 3.0, gradePoint: 4.0 },
          { id: "swe-303", code: "SWE-2104", name: "Database Engineering Lab (PostgreSQL)", credits: 1.5, gradePoint: 4.0 },
          { id: "swe-304", code: "SWE-2105", name: "Operating Systems & Shell Scripting", credits: 3.0, gradePoint: 3.75 },
          { id: "swe-305", code: "STAT-2101", name: "Statistics & Probability for Software", credits: 3.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "৪র্থ সেমিস্টার (২য় বর্ষ)",
        semesterNameEn: "4th Semester (Year 2)",
        courses: [
          { id: "swe-401", code: "SWE-2201", name: "Software Architecture & Design Patterns", credits: 3.0, gradePoint: 4.0 },
          { id: "swe-402", code: "SWE-2202", name: "Full-Stack Web Engineering (React/Node)", credits: 3.0, gradePoint: 4.0 },
          { id: "swe-403", code: "SWE-2203", name: "Web Engineering Project Lab", credits: 1.5, gradePoint: 4.0 },
          { id: "swe-404", code: "SWE-2205", name: "Computer Networks & Protocols", credits: 3.0, gradePoint: 3.75 },
          { id: "swe-405", code: "SWE-2206", name: "Agile & Scrum Studio Practicum", credits: 1.5, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৫ম সেমিস্টার (৩য় বর্ষ)",
        semesterNameEn: "5th Semester (Year 3)",
        courses: [
          { id: "swe-501", code: "SWE-3101", name: "Software Testing & Quality Assurance (QA)", credits: 3.0, gradePoint: 4.0 },
          { id: "swe-502", code: "SWE-3102", name: "Automated QA & Test Automation Lab", credits: 1.5, gradePoint: 4.0 },
          { id: "swe-503", code: "SWE-3103", name: "Mobile App Development (Flutter/Kotlin)", credits: 3.0, gradePoint: 4.0 },
          { id: "swe-504", code: "SWE-3105", name: "DevOps & Cloud Infrastructure (Docker/K8s)", credits: 3.0, gradePoint: 4.0 },
          { id: "swe-505", code: "MGT-3101", name: "Software Project Management & Economics", credits: 3.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৬ষ্ঠ সেমিস্টার (৩য় বর্ষ)",
        semesterNameEn: "6th Semester (Year 3)",
        courses: [
          { id: "swe-601", code: "SWE-3201", name: "Distributed Systems & Microservices", credits: 3.0, gradePoint: 4.0 },
          { id: "swe-602", code: "SWE-3203", name: "Machine Learning & AI for Software", credits: 3.0, gradePoint: 4.0 },
          { id: "swe-603", code: "SWE-3204", name: "Applied AI Systems Lab", credits: 1.5, gradePoint: 4.0 },
          { id: "swe-604", code: "SWE-3205", name: "Secure Coding & DevSecOps", credits: 3.0, gradePoint: 3.75 },
          { id: "swe-605", code: "LAW-3201", name: "Cyber Law & Intellectual Property", credits: 2.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৭ম সেমিস্টার (৪র্থ বর্ষ)",
        semesterNameEn: "7th Semester (Year 4)",
        courses: [
          { id: "swe-701", code: "SWE-4101", name: "Cloud-Native Enterprise Systems", credits: 3.0, gradePoint: 4.0 },
          { id: "swe-702", code: "SWE-4103", name: "Human-Computer Interaction (HCI & UI/UX)", credits: 3.0, gradePoint: 4.0 },
          { id: "swe-703", code: "SWE-4100", name: "Capstone Senior Software Project-I", credits: 2.0, gradePoint: 4.0 },
          { id: "swe-704", code: "SWE-4105", name: "Big Data & Real-Time Stream Analytics", credits: 3.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৮ম সেমিস্টার (৪র্থ বর্ষ)",
        semesterNameEn: "8th Semester (Year 4)",
        courses: [
          { id: "swe-801", code: "SWE-4201", name: "Software Reliability & Site Reliability Eng", credits: 3.0, gradePoint: 4.0 },
          { id: "swe-802", code: "SWE-4200", name: "Senior Capstone Defense & Product Release", credits: 4.0, gradePoint: 4.0 },
          { id: "swe-803", code: "SWE-4299", name: "Industry Software Internship (6 Months)", credits: 6.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // 8. BBA in Accounting & Information Systems (AIS)
  bba_ais: {
    key: "bba_ais",
    category: "BBA",
    categoryLabelBn: "বিবিএ (Bachelor of Business Administration)",
    titleBn: "বিবিএ ইন একাউন্টিং অ্যান্ড ইনফরমেশন সিস্টেমস (AIS)",
    titleEn: "BBA in Accounting & Information Systems (UGC Standard)",
    typicalTotalCredits: 130,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম সেমিস্টার (১ম বর্ষ)",
        semesterNameEn: "1st Semester (Year 1)",
        courses: [
          { id: "ais-101", code: "ACT-1101", name: "Principles of Accounting-I", credits: 3.0, gradePoint: 4.0 },
          { id: "ais-102", code: "BUS-1101", name: "Introduction to Business", credits: 3.0, gradePoint: 3.75 },
          { id: "ais-103", code: "ENG-1101", name: "Business English & Correspondence", credits: 3.0, gradePoint: 3.75 },
          { id: "ais-104", code: "MATH-1101", name: "Business Mathematics", credits: 3.0, gradePoint: 3.5 },
          { id: "ais-105", code: "CSE-1101", name: "Computer Applications in Accounting", credits: 3.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "২য় সেমিস্টার (১ম বর্ষ)",
        semesterNameEn: "2nd Semester (Year 1)",
        courses: [
          { id: "ais-201", code: "ACT-1201", name: "Principles of Accounting-II", credits: 3.0, gradePoint: 4.0 },
          { id: "ais-202", code: "ECO-1201", name: "Microeconomics for Business", credits: 3.0, gradePoint: 3.75 },
          { id: "ais-203", code: "MGT-1201", name: "Principles of Management", credits: 3.0, gradePoint: 4.0 },
          { id: "ais-204", code: "MKT-1201", name: "Principles of Marketing", credits: 3.0, gradePoint: 3.75 },
          { id: "ais-205", code: "STAT-1201", name: "Business Statistics-I", credits: 3.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "৩য় সেমিস্টার (২য় বর্ষ)",
        semesterNameEn: "3rd Semester (Year 2)",
        courses: [
          { id: "ais-301", code: "ACT-2101", name: "Intermediate Accounting-I", credits: 3.0, gradePoint: 4.0 },
          { id: "ais-302", code: "FIN-2101", name: "Principles of Finance", credits: 3.0, gradePoint: 3.75 },
          { id: "ais-303", code: "ECO-2101", name: "Macroeconomics for Business", credits: 3.0, gradePoint: 3.5 },
          { id: "ais-304", code: "LAW-2101", name: "Commercial & Business Law in BD", credits: 3.0, gradePoint: 3.75 },
          { id: "ais-305", code: "STAT-2101", name: "Business Statistics-II", credits: 3.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "৪র্থ সেমিস্টার (২য় বর্ষ)",
        semesterNameEn: "4th Semester (Year 2)",
        courses: [
          { id: "ais-401", code: "ACT-2201", name: "Intermediate Accounting-II", credits: 3.0, gradePoint: 4.0 },
          { id: "ais-402", code: "ACT-2202", name: "Cost Accounting & Cost Analysis", credits: 3.0, gradePoint: 4.0 },
          { id: "ais-403", code: "FIN-2201", name: "Managerial Finance", credits: 3.0, gradePoint: 3.75 },
          { id: "ais-404", code: "AIS-2201", name: "Accounting Information Systems (AIS)", credits: 3.0, gradePoint: 4.0 },
          { id: "ais-405", code: "MIS-2201", name: "Management Information Systems", credits: 3.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৫ম সেমিস্টার (৩য় বর্ষ)",
        semesterNameEn: "5th Semester (Year 3)",
        courses: [
          { id: "ais-501", code: "ACT-3101", name: "Advanced Financial Accounting-I", credits: 3.0, gradePoint: 4.0 },
          { id: "ais-502", code: "ACT-3102", name: "Management Accounting", credits: 3.0, gradePoint: 4.0 },
          { id: "ais-503", code: "TAX-3101", name: "Bangladesh Income Tax Law & Practice", credits: 3.0, gradePoint: 4.0 },
          { id: "ais-504", code: "AIS-3101", name: "Database Design for Accounting", credits: 3.0, gradePoint: 3.75 },
          { id: "ais-505", code: "AUD-3101", name: "Auditing & Assurance Standards-I", credits: 3.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৬ষ্ঠ সেমিস্টার (৩য় বর্ষ)",
        semesterNameEn: "6th Semester (Year 3)",
        courses: [
          { id: "ais-601", code: "ACT-3201", name: "Advanced Financial Accounting-II", credits: 3.0, gradePoint: 4.0 },
          { id: "ais-602", code: "TAX-3201", name: "Value Added Tax (VAT) & Customs in BD", credits: 3.0, gradePoint: 4.0 },
          { id: "ais-603", code: "AUD-3201", name: "Corporate Audit & Forensic Accounting", credits: 3.0, gradePoint: 4.0 },
          { id: "ais-604", code: "AIS-3201", name: "Enterprise Resource Planning (ERP/SAP)", credits: 3.0, gradePoint: 4.0 },
          { id: "ais-605", code: "FIN-3201", name: "Financial Statement Analysis", credits: 3.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৭ম সেমিস্টার (৪র্থ বর্ষ)",
        semesterNameEn: "7th Semester (Year 4)",
        courses: [
          { id: "ais-701", code: "ACT-4101", name: "Corporate Financial Reporting & IFRS", credits: 3.0, gradePoint: 4.0 },
          { id: "ais-702", code: "ACT-4102", name: "Strategic Cost & Management Accounting", credits: 3.0, gradePoint: 4.0 },
          { id: "ais-703", code: "AUD-4101", name: "IT Audit & Cyber Risk in Banking", credits: 3.0, gradePoint: 3.75 },
          { id: "ais-704", code: "RES-4101", name: "Accounting Research Methodology", credits: 3.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৮ম সেমিস্টার (৪র্থ বর্ষ)",
        semesterNameEn: "8th Semester (Year 4)",
        courses: [
          { id: "ais-801", code: "ETH-4201", name: "Professional Ethics & Corporate Governance", credits: 3.0, gradePoint: 4.0 },
          { id: "ais-802", code: "INT-4299", name: "CA Firm / Corporate Accounting Internship", credits: 6.0, gradePoint: 4.0 },
          { id: "ais-803", code: "RES-4200", name: "Capstone Thesis / Monograph Defense", credits: 3.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // 9. BBA in Finance & Banking
  bba_fin: {
    key: "bba_fin",
    category: "BBA",
    categoryLabelBn: "বিবিএ (Bachelor of Business Administration)",
    titleBn: "বিবিএ ইন ফাইন্যান্স অ্যান্ড ব্যাংকিং",
    titleEn: "BBA in Finance & Banking (UGC Standard)",
    typicalTotalCredits: 130,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম সেমিস্টার (১ম বর্ষ)",
        semesterNameEn: "1st Semester (Year 1)",
        courses: [
          { id: "fin-101", code: "BUS-1101", name: "Introduction to Business & Finance", credits: 3.0, gradePoint: 4.0 },
          { id: "fin-102", code: "ACT-1101", name: "Financial Accounting-I", credits: 3.0, gradePoint: 4.0 },
          { id: "fin-103", code: "ENG-1101", name: "Business Communication & English", credits: 3.0, gradePoint: 3.75 },
          { id: "fin-104", code: "MATH-1101", name: "Mathematics for Finance", credits: 3.0, gradePoint: 3.5 },
          { id: "fin-105", code: "ECO-1101", name: "Principles of Microeconomics", credits: 3.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "২য় সেমিস্টার (১ম বর্ষ)",
        semesterNameEn: "2nd Semester (Year 1)",
        courses: [
          { id: "fin-201", code: "FIN-1201", name: "Principles of Finance", credits: 3.0, gradePoint: 4.0 },
          { id: "fin-202", code: "ACT-1201", name: "Financial Accounting-II", credits: 3.0, gradePoint: 3.75 },
          { id: "fin-203", code: "ECO-1201", name: "Macroeconomics & Monetary Policy", credits: 3.0, gradePoint: 3.75 },
          { id: "fin-204", code: "MGT-1201", name: "Principles of Management", credits: 3.0, gradePoint: 4.0 },
          { id: "fin-205", code: "STAT-1201", name: "Financial Statistics-I", credits: 3.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "৩য় সেমিস্টার (২য় বর্ষ)",
        semesterNameEn: "3rd Semester (Year 2)",
        courses: [
          { id: "fin-301", code: "FIN-2101", name: "Financial Institutions & Markets in BD", credits: 3.0, gradePoint: 4.0 },
          { id: "fin-302", code: "FIN-2102", name: "Commercial Banking Operations & Law", credits: 3.0, gradePoint: 4.0 },
          { id: "fin-303", code: "ACT-2101", name: "Managerial Accounting", credits: 3.0, gradePoint: 3.75 },
          { id: "fin-304", code: "MKT-2101", name: "Principles of Marketing", credits: 3.0, gradePoint: 3.75 },
          { id: "fin-305", code: "STAT-2101", name: "Financial Statistics-II", credits: 3.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "৪র্থ সেমিস্টার (২য় বর্ষ)",
        semesterNameEn: "4th Semester (Year 2)",
        courses: [
          { id: "fin-401", code: "FIN-2201", name: "Corporate Finance", credits: 3.0, gradePoint: 4.0 },
          { id: "fin-402", code: "FIN-2202", name: "Central Banking & Monetary Regulation", credits: 3.0, gradePoint: 4.0 },
          { id: "fin-403", code: "FIN-2203", name: "Islamic Banking & Finance (Shariah Law)", credits: 3.0, gradePoint: 4.0 },
          { id: "fin-404", code: "LAW-2201", name: "Banking & Negotiable Instruments Law", credits: 3.0, gradePoint: 3.75 },
          { id: "fin-405", code: "MIS-2201", name: "Financial Modeling with Excel/Python", credits: 3.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৫ম সেমিস্টার (৩য় বর্ষ)",
        semesterNameEn: "5th Semester (Year 3)",
        courses: [
          { id: "fin-501", code: "FIN-3101", name: "Investment Analysis & Security Valuation", credits: 3.0, gradePoint: 4.0 },
          { id: "fin-502", code: "FIN-3102", name: "Credit Management & SME Financing", credits: 3.0, gradePoint: 4.0 },
          { id: "fin-503", code: "FIN-3103", name: "Insurance & Risk Management", credits: 3.0, gradePoint: 3.75 },
          { id: "fin-504", code: "TAX-3101", name: "Direct & Indirect Corporate Taxation", credits: 3.0, gradePoint: 3.75 },
          { id: "fin-505", code: "RES-3101", name: "Business & Financial Research Methods", credits: 3.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৬ষ্ঠ সেমিস্টার (৩য় বর্ষ)",
        semesterNameEn: "6th Semester (Year 3)",
        courses: [
          { id: "fin-601", code: "FIN-3201", name: "Portfolio Management & Mutual Funds", credits: 3.0, gradePoint: 4.0 },
          { id: "fin-602", code: "FIN-3202", name: "International Financial Management", credits: 3.0, gradePoint: 4.0 },
          { id: "fin-603", code: "FIN-3203", name: "Financial Derivatives & Risk Hedging", credits: 3.0, gradePoint: 3.75 },
          { id: "fin-604", code: "FIN-3204", name: "FinTech, Mobile Banking & Digital Payment", credits: 3.0, gradePoint: 4.0 },
          { id: "fin-605", code: "MGT-3201", name: "Strategic Management", credits: 3.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৭ম সেমিস্টার (৪র্থ বর্ষ)",
        semesterNameEn: "7th Semester (Year 4)",
        courses: [
          { id: "fin-701", code: "FIN-4101", name: "Investment Banking & Mergers & Acquisition", credits: 3.0, gradePoint: 4.0 },
          { id: "fin-702", code: "FIN-4102", name: "Real Estate Finance & Microcredit in BD", credits: 3.0, gradePoint: 4.0 },
          { id: "fin-703", code: "FIN-4103", name: "Corporate Financial Engineering & Valuation", credits: 3.0, gradePoint: 4.0 },
          { id: "fin-704", code: "ETH-4101", name: "Business Ethics & Corporate Compliance", credits: 3.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৮ম সেমিস্টার (৪র্থ বর্ষ)",
        semesterNameEn: "8th Semester (Year 4)",
        courses: [
          { id: "fin-801", code: "FIN-4200", name: "Senior Research Monograph Defense", credits: 3.0, gradePoint: 4.0 },
          { id: "fin-802", code: "INT-4299", name: "Commercial Bank / Financial Org Internship", credits: 6.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // 10. BBA in Marketing
  bba_mkt: {
    key: "bba_mkt",
    category: "BBA",
    categoryLabelBn: "বিবিএ (Bachelor of Business Administration)",
    titleBn: "বিবিএ ইন মার্কেটিং অ্যান্ড ডিজিটাল ব্র্যান্ডিং",
    titleEn: "BBA in Marketing & Digital Brand Strategy (UGC Standard)",
    typicalTotalCredits: 130,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম সেমিস্টার (১ম বর্ষ)",
        semesterNameEn: "1st Semester (Year 1)",
        courses: [
          { id: "mkt-101", code: "MKT-1101", name: "Principles of Marketing", credits: 3.0, gradePoint: 4.0 },
          { id: "mkt-102", code: "BUS-1101", name: "Introduction to Business & Commerce", credits: 3.0, gradePoint: 3.75 },
          { id: "mkt-103", code: "ENG-1101", name: "Business English & Copywriting", credits: 3.0, gradePoint: 4.0 },
          { id: "mkt-104", code: "ACT-1101", name: "Financial Accounting-I", credits: 3.0, gradePoint: 3.5 },
          { id: "mkt-105", code: "MATH-1101", name: "Business Mathematics", credits: 3.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "২য় সেমিস্টার (১ম বর্ষ)",
        semesterNameEn: "2nd Semester (Year 1)",
        courses: [
          { id: "mkt-201", code: "MKT-1201", name: "Consumer Behavior & Buyer Psychology", credits: 3.0, gradePoint: 4.0 },
          { id: "mkt-202", code: "MGT-1201", name: "Principles of Management", credits: 3.0, gradePoint: 4.0 },
          { id: "mkt-203", code: "ECO-1201", name: "Principles of Microeconomics", credits: 3.0, gradePoint: 3.75 },
          { id: "mkt-204", code: "STAT-1201", name: "Business Statistics-I", credits: 3.0, gradePoint: 3.5 },
          { id: "mkt-205", code: "CSE-1201", name: "Digital Tools & Graphic Design for Marketing", credits: 3.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "৩য় সেমিস্টার (২য় বর্ষ)",
        semesterNameEn: "3rd Semester (Year 2)",
        courses: [
          { id: "mkt-301", code: "MKT-2101", name: "Integrated Marketing Communications (IMC)", credits: 3.0, gradePoint: 4.0 },
          { id: "mkt-302", code: "MKT-2102", name: "Sales Management & Personal Selling", credits: 3.0, gradePoint: 3.75 },
          { id: "mkt-303", code: "FIN-2101", name: "Principles of Finance", credits: 3.0, gradePoint: 3.5 },
          { id: "mkt-304", code: "ECO-2101", name: "Principles of Macroeconomics", credits: 3.0, gradePoint: 3.5 },
          { id: "mkt-305", code: "STAT-2101", name: "Business Statistics-II", credits: 3.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "৪র্থ সেমিস্টার (২য় বর্ষ)",
        semesterNameEn: "4th Semester (Year 2)",
        courses: [
          { id: "mkt-401", code: "MKT-2201", name: "Brand Management & Product Strategy", credits: 3.0, gradePoint: 4.0 },
          { id: "mkt-402", code: "MKT-2202", name: "Digital Marketing & Social Media Strategy", credits: 3.0, gradePoint: 4.0 },
          { id: "mkt-403", code: "ACT-2201", name: "Managerial Accounting", credits: 3.0, gradePoint: 3.5 },
          { id: "mkt-404", code: "LAW-2201", name: "Consumer Rights & Advertising Law", credits: 3.0, gradePoint: 3.75 },
          { id: "mkt-405", code: "MIS-2201", name: "Marketing Information Systems & CRM", credits: 3.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৫ম সেমিস্টার (৩য় বর্ষ)",
        semesterNameEn: "5th Semester (Year 3)",
        courses: [
          { id: "mkt-501", code: "MKT-3101", name: "Marketing Research & Analytics", credits: 3.0, gradePoint: 4.0 },
          { id: "mkt-502", code: "MKT-3102", name: "Services Marketing", credits: 3.0, gradePoint: 3.75 },
          { id: "mkt-503", code: "MKT-3103", name: "Retail & Supply Chain Management", credits: 3.0, gradePoint: 3.75 },
          { id: "mkt-504", code: "MKT-3104", name: "E-Commerce Strategy & F-Commerce in BD", credits: 3.0, gradePoint: 4.0 },
          { id: "mkt-505", code: "MGT-3101", name: "Human Resource Management", credits: 3.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৬ষ্ঠ সেমিস্টার (৩য় বর্ষ)",
        semesterNameEn: "6th Semester (Year 3)",
        courses: [
          { id: "mkt-601", code: "MKT-3201", name: "International Marketing & Export Policy", credits: 3.0, gradePoint: 4.0 },
          { id: "mkt-602", code: "MKT-3202", name: "Advertising & Media Planning", credits: 3.0, gradePoint: 4.0 },
          { id: "mkt-603", code: "MKT-3203", name: "Public Relations & Corporate Image", credits: 3.0, gradePoint: 3.75 },
          { id: "mkt-604", code: "MKT-3204", name: "Search Engine Optimization (SEO) & Web Ads", credits: 3.0, gradePoint: 4.0 },
          { id: "mkt-605", code: "MGT-3201", name: "Strategic Management", credits: 3.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৭ম সেমিস্টার (৪র্থ বর্ষ)",
        semesterNameEn: "7th Semester (Year 4)",
        courses: [
          { id: "mkt-701", code: "MKT-4101", name: "Strategic Marketing & Case Analysis", credits: 3.0, gradePoint: 4.0 },
          { id: "mkt-702", code: "MKT-4102", name: "Customer Relationship Management (CRM)", credits: 3.0, gradePoint: 4.0 },
          { id: "mkt-703", code: "MKT-4103", name: "Sustainable & Green Marketing", credits: 3.0, gradePoint: 3.75 },
          { id: "mkt-704", code: "ETH-4101", name: "Marketing Ethics & Societal Marketing", credits: 3.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৮ম সেমিস্টার (৪র্থ বর্ষ)",
        semesterNameEn: "8th Semester (Year 4)",
        courses: [
          { id: "mkt-801", code: "MKT-4200", name: "Senior Marketing Capstone Project", credits: 3.0, gradePoint: 4.0 },
          { id: "mkt-802", code: "INT-4299", name: "Corporate Brand Agency / FMCG Internship", credits: 6.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // 11. BA in Bangla Language & Literature
  ba_bangla: {
    key: "ba_bangla",
    category: "BA",
    categoryLabelBn: "বিএ অনার্স (Bachelor of Arts)",
    titleBn: "বিএ (অনার্স) ইন বাংলা ভাষা ও সাহিত্য",
    titleEn: "B.A. (Hons) in Bengali Language & Literature (NU/DU Framework)",
    typicalTotalCredits: 124,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম সেমিস্টার (১ম বর্ষ)",
        semesterNameEn: "1st Semester (Year 1)",
        courses: [
          { id: "ban-101", code: "BAN-1101", name: "বাংলা সাহিত্যের ইতিহাস: প্রাচীন ও মধ্যযুগ", credits: 4.0, gradePoint: 4.0 },
          { id: "ban-102", code: "BAN-1102", name: "প্রাচীন ও মধ্যযুগের কবিতা (চর্যাপদ ও মঙ্গলকাব্য)", credits: 4.0, gradePoint: 4.0 },
          { id: "ban-103", code: "BAN-1103", name: "বাংলা ভাষার ব্যাকরণ ও নির্মিতি", credits: 4.0, gradePoint: 3.75 },
          { id: "ban-104", code: "ENG-1101", name: "Functional English", credits: 3.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "২য় সেমিস্টার (১ম বর্ষ)",
        semesterNameEn: "2nd Semester (Year 1)",
        courses: [
          { id: "ban-201", code: "BAN-1201", name: "বাংলা সাহিত্যের ইতিহাস: আধুনিক যুগ (১৮০১-১৯৪৭)", credits: 4.0, gradePoint: 4.0 },
          { id: "ban-202", code: "BAN-1202", name: "আধুনিক বাংলা কবিতা-১ (মধুসূদন ও বিহারীলাল)", credits: 4.0, gradePoint: 3.75 },
          { id: "ban-203", code: "BAN-1203", name: "রবীন্দ্রসাহিত্য: কবিতা ও ছোটগল্প", credits: 4.0, gradePoint: 4.0 },
          { id: "ban-204", code: "HIS-1201", name: "বাংলাদেশের ইতিহাস ও মুক্তিযুদ্ধ", credits: 3.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "৩য় সেমিস্টার (২য় বর্ষ)",
        semesterNameEn: "3rd Semester (Year 2)",
        courses: [
          { id: "ban-301", code: "BAN-2101", name: "নজরুল সাহিত্য: কবিতা, সংগীত ও প্রবন্ধ", credits: 4.0, gradePoint: 4.0 },
          { id: "ban-302", code: "BAN-2102", name: "আধুনিক বাংলা উপন্যাস-১ (বঙ্কিম ও শরৎচন্দ্র)", credits: 4.0, gradePoint: 3.75 },
          { id: "ban-303", code: "BAN-2103", name: "বাংলা ধ্বনিতত্ত্ব ও রূপতত্ত্ব", credits: 4.0, gradePoint: 3.75 },
          { id: "ban-304", code: "SOC-2101", name: "সমাজবিজ্ঞান পরিচিতি", credits: 3.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "৪র্থ সেমিস্টার (২য় বর্ষ)",
        semesterNameEn: "4th Semester (Year 2)",
        courses: [
          { id: "ban-401", code: "BAN-2201", name: "বাংলা নাটক ও নাট্যমঞ্চ (গিরিশচন্দ্র থেকে সেলিম আল দীন)", credits: 4.0, gradePoint: 4.0 },
          { id: "ban-402", code: "BAN-2202", name: "আধুনিক বাংলা উপন্যাস-২ (তারাশঙ্কর ও মানিক)", credits: 4.0, gradePoint: 3.75 },
          { id: "ban-403", code: "BAN-2203", name: "বাংলা ছন্দ ও অলঙ্কারশাস্ত্র", credits: 4.0, gradePoint: 4.0 },
          { id: "ban-404", code: "PHI-2201", name: "বাঙালি দর্শন ও চিন্তাধারা", credits: 3.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৫ম সেমিস্টার (৩য় বর্ষ)",
        semesterNameEn: "5th Semester (Year 3)",
        courses: [
          { id: "ban-501", code: "BAN-3101", name: "পঞ্চাশ ও ষাটের দশকের আধুনিক কবিতা (শামসুর রাহমান)", credits: 4.0, gradePoint: 4.0 },
          { id: "ban-502", code: "BAN-3102", name: "বাংলাদেশের উপন্যাস ও ছোটগল্প (শওকত ওসমান, আখতারুজ্জামান ইলিয়াস)", credits: 4.0, gradePoint: 4.0 },
          { id: "ban-503", code: "BAN-3103", name: "বাংলা গদ্যরীতি ও প্রবন্ধ সাহিত্য", credits: 4.0, gradePoint: 3.75 },
          { id: "ban-504", code: "BAN-3104", name: "বাংলা ব্যাকরণ ও ভাষাতাত্ত্বিক গবেষণা", credits: 3.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৬ষ্ঠ সেমিস্টার (৩য় বর্ষ)",
        semesterNameEn: "6th Semester (Year 3)",
        courses: [
          { id: "ban-601", code: "BAN-3201", name: "বাংলা লোকসাহিত্য ও ফোকলোর তত্ত্ব", credits: 4.0, gradePoint: 4.0 },
          { id: "ban-602", code: "BAN-3202", name: "প্রাচ্য ও পাশ্চাত্য সাহিত্যতত্ত্ব ও সমালোচনা", credits: 4.0, gradePoint: 4.0 },
          { id: "ban-603", code: "BAN-3203", name: "বাংলাদেশের মুক্তিযুদ্ধভিত্তিক সাহিত্য", credits: 4.0, gradePoint: 4.0 },
          { id: "ban-604", code: "BAN-3204", name: "অনুবাদ সাহিত্য ও তুলনামূলক সাহিত্য", credits: 3.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৭ম সেমিস্টার (৪র্থ বর্ষ)",
        semesterNameEn: "7th Semester (Year 4)",
        courses: [
          { id: "ban-701", code: "BAN-4101", name: "আধুনিক বিশ্বের সাহিত্য (বিশ্বসাহিত্য রূপরেখা)", credits: 4.0, gradePoint: 4.0 },
          { id: "ban-702", code: "BAN-4102", name: "বাংলা উপভাষা ও সমাজভাষাতত্ত্ব", credits: 4.0, gradePoint: 3.75 },
          { id: "ban-703", code: "BAN-4103", name: "ব্যবহারিক বাংলা ও প্রুফরিডিং-সম্পাদনা", credits: 4.0, gradePoint: 4.0 },
          { id: "ban-704", code: "RES-4101", name: "গবেষণাপদ্ধতি ও প্রবন্ধ লিখন", credits: 3.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৮ম সেমিস্টার (৪র্থ বর্ষ)",
        semesterNameEn: "8th Semester (Year 4)",
        courses: [
          { id: "ban-801", code: "BAN-4200", name: "স্নাতক গবেষণা সন্দর্ভ (Senior Dissertation/Thesis)", credits: 6.0, gradePoint: 4.0 },
          { id: "ban-802", code: "BAN-4201", name: "মৌখিক পরীক্ষা (Comprehensive Viva-Voce)", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // 12. BSS in Economics
  bss_econ: {
    key: "bss_econ",
    category: "BA",
    categoryLabelBn: "বিএসএস / বিএ (Bachelor of Social Sciences)",
    titleBn: "বিএসএস (অনার্স) ইন অর্থনীতি (Economics)",
    titleEn: "B.S.S. (Hons) in Economics (UGC Standard)",
    typicalTotalCredits: 128,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম সেমিস্টার (১ম বর্ষ)",
        semesterNameEn: "1st Semester (Year 1)",
        courses: [
          { id: "eco-101", code: "ECO-1101", name: "Principles of Microeconomics-I", credits: 4.0, gradePoint: 4.0 },
          { id: "eco-102", code: "MATH-1101", name: "Mathematical Economics-I", credits: 4.0, gradePoint: 3.75 },
          { id: "eco-103", code: "ENG-1101", name: "English Reading & Composition", credits: 3.0, gradePoint: 3.75 },
          { id: "eco-104", code: "CSE-1101", name: "Computer Applications for Social Science", credits: 3.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "২য় সেমিস্টার (১ম বর্ষ)",
        semesterNameEn: "2nd Semester (Year 1)",
        courses: [
          { id: "eco-201", code: "ECO-1201", name: "Principles of Macroeconomics-I", credits: 4.0, gradePoint: 4.0 },
          { id: "eco-202", code: "MATH-1201", name: "Mathematical Economics-II", credits: 4.0, gradePoint: 3.75 },
          { id: "eco-203", code: "STAT-1201", name: "Economic Statistics-I", credits: 4.0, gradePoint: 3.5 },
          { id: "eco-204", code: "BGS-1201", name: "Bangladesh History & Economy", credits: 3.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "৩য় সেমিস্টার (২য় বর্ষ)",
        semesterNameEn: "3rd Semester (Year 2)",
        courses: [
          { id: "eco-301", code: "ECO-2101", name: "Intermediate Microeconomics", credits: 4.0, gradePoint: 4.0 },
          { id: "eco-302", code: "ECO-2102", name: "Intermediate Macroeconomics", credits: 4.0, gradePoint: 4.0 },
          { id: "eco-303", code: "STAT-2101", name: "Economic Statistics-II & Probability", credits: 4.0, gradePoint: 3.5 },
          { id: "eco-304", code: "SOC-2101", name: "Sociology & Social Stratification", credits: 3.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "৪র্থ সেমিস্টার (২য় বর্ষ)",
        semesterNameEn: "4th Semester (Year 2)",
        courses: [
          { id: "eco-401", code: "ECO-2201", name: "Introductory Econometrics", credits: 4.0, gradePoint: 4.0 },
          { id: "eco-402", code: "ECO-2202", name: "Econometrics Computer Lab (Stata/R)", credits: 2.0, gradePoint: 4.0 },
          { id: "eco-403", code: "ECO-2203", name: "Public Finance & Taxation in BD", credits: 4.0, gradePoint: 3.75 },
          { id: "eco-404", code: "ECO-2204", name: "Agricultural & Rural Economics", credits: 4.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৫ম সেমিস্টার (৩য় বর্ষ)",
        semesterNameEn: "5th Semester (Year 3)",
        courses: [
          { id: "eco-501", code: "ECO-3101", name: "Advanced Econometrics", credits: 4.0, gradePoint: 4.0 },
          { id: "eco-502", code: "ECO-3102", name: "International Trade Theory & Policy", credits: 4.0, gradePoint: 4.0 },
          { id: "eco-503", code: "ECO-3103", name: "Money, Banking & Financial Markets", credits: 4.0, gradePoint: 3.75 },
          { id: "eco-504", code: "ECO-3104", name: "History of Economic Thought", credits: 3.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৬ষ্ঠ সেমিস্টার (৩য় বর্ষ)",
        semesterNameEn: "6th Semester (Year 3)",
        courses: [
          { id: "eco-601", code: "ECO-3201", name: "Development Economics: Models & Policy", credits: 4.0, gradePoint: 4.0 },
          { id: "eco-602", code: "ECO-3202", name: "International Finance & Exchange Rates", credits: 4.0, gradePoint: 4.0 },
          { id: "eco-603", code: "ECO-3203", name: "Environmental & Natural Resource Economics", credits: 4.0, gradePoint: 3.75 },
          { id: "eco-604", code: "ECO-3204", name: "Labor Economics & Human Capital", credits: 3.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৭ম সেমিস্টার (৪র্থ বর্ষ)",
        semesterNameEn: "7th Semester (Year 4)",
        courses: [
          { id: "eco-701", code: "ECO-4101", name: "Applied Bangladesh Economy & Planning", credits: 4.0, gradePoint: 4.0 },
          { id: "eco-702", code: "ECO-4102", name: "Health & Education Economics", credits: 4.0, gradePoint: 3.75 },
          { id: "eco-703", code: "ECO-4103", name: "Industrial Economics & Game Theory", credits: 4.0, gradePoint: 4.0 },
          { id: "eco-704", code: "RES-4101", name: "Economic Research Methodology & Survey", credits: 3.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৮ম সেমিস্টার (৪র্থ বর্ষ)",
        semesterNameEn: "8th Semester (Year 4)",
        courses: [
          { id: "eco-801", code: "ECO-4200", name: "Senior Research Monograph / Thesis Defense", credits: 6.0, gradePoint: 4.0 },
          { id: "eco-802", code: "INT-4299", name: "Think Tank / Bank / Research Internship", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // 13. BA in Islamic Studies
  ba_islamic: {
    key: "ba_islamic",
    category: "BA",
    categoryLabelBn: "বিএ অনার্স (Bachelor of Arts)",
    titleBn: "বিএ (অনার্স) ইন ইসলামিক স্টাডিজ ও কালচার",
    titleEn: "B.A. (Hons) in Islamic Studies & Culture (NU/DU Framework)",
    typicalTotalCredits: 120,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম সেমিস্টার (১ম বর্ষ)",
        semesterNameEn: "1st Semester (Year 1)",
        courses: [
          { id: "is-101", code: "IS-1101", name: "উলুমুল কুরআন ও তাফসির শাস্ত্র", credits: 4.0, gradePoint: 4.0 },
          { id: "is-102", code: "IS-1102", name: "আরবি ভাষা ও ব্যাকরণ-১ (নাহু ও সরফ)", credits: 4.0, gradePoint: 3.75 },
          { id: "is-103", code: "IS-1103", name: "ইসলামের ইতিহাস: মহানবী (সা.)-এর জীবন ও খেলাফতে রাশেদা", credits: 4.0, gradePoint: 4.0 },
          { id: "is-104", code: "ENG-1101", name: "Functional English", credits: 3.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "২য় সেমিস্টার (১ম বর্ষ)",
        semesterNameEn: "2nd Semester (Year 1)",
        courses: [
          { id: "is-201", code: "IS-1201", name: "উলুমুল হাদিস ও সিহাহ সিত্তাহ পরিচিতি", credits: 4.0, gradePoint: 4.0 },
          { id: "is-202", code: "IS-1202", name: "আরবি ভাষা ও ব্যাকরণ-২", credits: 4.0, gradePoint: 3.75 },
          { id: "is-203", code: "IS-1203", name: "ইসলামের ইতিহাস: উমাইয়া ও আব্বাসীয় খেলাফত", credits: 4.0, gradePoint: 3.75 },
          { id: "is-204", code: "BGS-1201", name: "বাংলাদেশের ইতিহাস ও সমাজ", credits: 3.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "৩য় সেমিস্টার (২য় বর্ষ)",
        semesterNameEn: "3rd Semester (Year 2)",
        courses: [
          { id: "is-301", code: "IS-2101", name: "সিলেক্টেড হাদিস পাঠ (মুয়াত্তা ও রিয়াযুস সালেহীন)", credits: 4.0, gradePoint: 4.0 },
          { id: "is-302", code: "IS-2102", name: "ফিকহ শাস্ত্র ও পারিবারিক আইন", credits: 4.0, gradePoint: 4.0 },
          { id: "is-303", code: "IS-2103", name: "ইসলামের দাওয়াহ ও তাবলিগ পদ্ধতি", credits: 3.0, gradePoint: 3.75 },
          { id: "is-304", code: "IS-2104", name: "ভারতে মুসলিম শাসন ও সুফিবাদ", credits: 4.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "৪র্থ সেমিস্টার (২য় বর্ষ)",
        semesterNameEn: "4th Semester (Year 2)",
        courses: [
          { id: "is-401", code: "IS-2201", name: "উসুলুল ফিকহ ও ইসলামিক আইনতত্ত্ব", credits: 4.0, gradePoint: 4.0 },
          { id: "is-402", code: "IS-2202", name: "ইসলামী রাষ্ট্রবিজ্ঞান ও মানবাধিকার", credits: 4.0, gradePoint: 4.0 },
          { id: "is-403", code: "IS-2203", name: "ইসলামী নৈতিকতা ও শিষ্টাচার", credits: 3.0, gradePoint: 4.0 },
          { id: "is-404", code: "CSE-2201", name: "কম্পিউটার ও তথ্যপ্রযুক্তি অ্যাপ্লিকেশন", credits: 3.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৫ম সেমিস্টার (৩য় বর্ষ)",
        semesterNameEn: "5th Semester (Year 3)",
        courses: [
          { id: "is-501", code: "IS-3101", name: "ইসলামী অর্থনীতি ও যাকাত-অকফ ব্যবস্থাপনা", credits: 4.0, gradePoint: 4.0 },
          { id: "is-502", code: "IS-3102", name: "ইসলামী ব্যাংকিং ও আধুনিক আর্থিক লেনদেন", credits: 4.0, gradePoint: 4.0 },
          { id: "is-503", code: "IS-3103", name: "আধুনিক বিশ্বে মুসলিম সংখ্যালঘু সমাজ", credits: 4.0, gradePoint: 3.75 },
          { id: "is-504", code: "IS-3104", name: "ইলমুল কালাম ও ইসলামী ধর্মতত্ত্ব", credits: 3.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৬ষ্ঠ সেমিস্টার (৩য় বর্ষ)",
        semesterNameEn: "6th Semester (Year 3)",
        courses: [
          { id: "is-601", code: "IS-3201", name: "তুলনামূলক ধর্মতত্ত্ব (খ্রিস্টধর্ম, ইহুদি ও হিন্দুধর্ম)", credits: 4.0, gradePoint: 4.0 },
          { id: "is-602", code: "IS-3202", name: "ইসলামী চিত্রকলা, ক্যালিগ্রাফি ও স্থাপত্যশিল্প", credits: 4.0, gradePoint: 3.75 },
          { id: "is-603", code: "IS-3203", name: "ইসলাম ও সমসাময়িক মতবাদ (ধর্মনিরপেক্ষতা ও আধুনিকতা)", credits: 4.0, gradePoint: 4.0 },
          { id: "is-604", code: "IS-3204", name: "ইসলামী পরিবেশবিদ্যা ও জীবনীতিবিদ্যা", credits: 3.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৭ম সেমিস্টার (৪র্থ বর্ষ)",
        semesterNameEn: "7th Semester (Year 4)",
        courses: [
          { id: "is-701", code: "IS-4101", name: "সমকালীন বিশ্ব ও মুসলিম উম্মাহর সংকট ও সম্ভাবনা", credits: 4.0, gradePoint: 4.0 },
          { id: "is-702", code: "IS-4102", name: "ইসলামী উত্তরাধিকার ও ফারায়েজ আইন", credits: 4.0, gradePoint: 4.0 },
          { id: "is-703", code: "IS-4103", name: "ইসলামী সমাজবিজ্ঞান ও অপরাধবিজ্ঞান", credits: 4.0, gradePoint: 3.75 },
          { id: "is-704", code: "RES-4101", name: "ইসলামী গবেষণাপদ্ধতি ও সন্দর্ভ রচনা", credits: 3.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৮ম সেমিস্টার (৪র্থ বর্ষ)",
        semesterNameEn: "8th Semester (Year 4)",
        courses: [
          { id: "is-801", code: "IS-4200", name: "স্নাতক গবেষণা সন্দর্ভ (Senior Dissertation/Thesis)", credits: 6.0, gradePoint: 4.0 },
          { id: "is-802", code: "IS-4201", name: "মৌখিক পরীক্ষা (Comprehensive Viva-Voce)", credits: 4.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // 14. Diploma in Electrical Technology (BTEB)
  diploma_electrical: {
    key: "diploma_electrical",
    category: "DIPLOMA",
    categoryLabelBn: "ডিপ্লোমা ইন ইঞ্জিনিয়ারিং (BTEB ৪ বছর মেয়াদি)",
    titleBn: "ডিপ্লোমা ইন ইলেকট্রিক্যাল টেকনোলজি (কারিগরি বোর্ড - BTEB)",
    titleEn: "Diploma in Electrical Technology (4-Year BTEB Curriculum)",
    typicalTotalCredits: 145,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম পর্ব (১ম বর্ষ)",
        semesterNameEn: "1st Semester (Year 1)",
        courses: [
          { id: "de-101", code: "66711", name: "Basic Electricity", credits: 3.0, gradePoint: 4.0 },
          { id: "de-102", code: "65911", name: "Mathematics-1", credits: 4.0, gradePoint: 3.75 },
          { id: "de-103", code: "65912", name: "Physics-1", credits: 4.0, gradePoint: 3.5 },
          { id: "de-104", code: "65711", name: "Bangla Literature & Language", credits: 3.0, gradePoint: 4.0 },
          { id: "de-105", code: "66712", name: "Electrical Engineering Drawing", credits: 2.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "২য় পর্ব (১ম বর্ষ)",
        semesterNameEn: "2nd Semester (Year 1)",
        courses: [
          { id: "de-201", code: "66721", name: "Electrical Circuits-1", credits: 4.0, gradePoint: 4.0 },
          { id: "de-202", code: "66822", name: "Electronic Devices & Circuits", credits: 3.0, gradePoint: 3.75 },
          { id: "de-203", code: "65921", name: "Mathematics-2", credits: 4.0, gradePoint: 3.75 },
          { id: "de-204", code: "65922", name: "Physics-2", credits: 4.0, gradePoint: 3.5 },
          { id: "de-205", code: "65811", name: "Social Science", credits: 2.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "৩য় পর্ব (২য় বর্ষ)",
        semesterNameEn: "3rd Semester (Year 2)",
        courses: [
          { id: "de-301", code: "66731", name: "Electrical Circuits-2", credits: 4.0, gradePoint: 4.0 },
          { id: "de-302", code: "66732", name: "Electrical Engineering Materials", credits: 3.0, gradePoint: 3.75 },
          { id: "de-303", code: "66835", name: "Digital Electronics", credits: 3.0, gradePoint: 3.5 },
          { id: "de-304", code: "65931", name: "Mathematics-3", credits: 4.0, gradePoint: 3.75 },
          { id: "de-305", code: "65722", name: "Communicative English", credits: 3.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "৪র্থ পর্ব (২য় বর্ষ)",
        semesterNameEn: "4th Semester (Year 2)",
        courses: [
          { id: "de-401", code: "66741", name: "DC Machines & Transformers", credits: 4.0, gradePoint: 4.0 },
          { id: "de-402", code: "66742", name: "Electrical Installation & Maintenance", credits: 3.0, gradePoint: 4.0 },
          { id: "de-403", code: "66743", name: "Applied Mechanics", credits: 3.0, gradePoint: 3.5 },
          { id: "de-404", code: "66842", name: "Industrial Electronics", credits: 3.0, gradePoint: 3.75 },
          { id: "de-405", code: "65841", name: "Business Communication", credits: 2.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৫ম পর্ব (৩য় বর্ষ)",
        semesterNameEn: "5th Semester (Year 3)",
        courses: [
          { id: "de-501", code: "66751", name: "AC Machines-1 (Induction Motors)", credits: 4.0, gradePoint: 4.0 },
          { id: "de-502", code: "66752", name: "Transmission & Distribution of Electrical Power-1", credits: 4.0, gradePoint: 4.0 },
          { id: "de-503", code: "66753", name: "Electrical Measurement & Instrumentation-1", credits: 3.0, gradePoint: 3.75 },
          { id: "de-504", code: "66654", name: "Microprocessor & Interfacing", credits: 3.0, gradePoint: 3.5 },
          { id: "de-505", code: "65851", name: "Accounting Theory & Practice", credits: 2.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৬ষ্ঠ পর্ব (৩য় বর্ষ)",
        semesterNameEn: "6th Semester (Year 3)",
        courses: [
          { id: "de-601", code: "66761", name: "AC Machines-2 (Synchronous Machines)", credits: 4.0, gradePoint: 4.0 },
          { id: "de-602", code: "66762", name: "Transmission & Distribution of Electrical Power-2", credits: 4.0, gradePoint: 4.0 },
          { id: "de-603", code: "66763", name: "Switchgear & Protection", credits: 4.0, gradePoint: 4.0 },
          { id: "de-604", code: "66764", name: "Solar Energy & Renewable Technology", credits: 3.0, gradePoint: 4.0 },
          { id: "de-605", code: "65852", name: "Industrial Management", credits: 2.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৭ম পর্ব (৪র্থ বর্ষ)",
        semesterNameEn: "7th Semester (Year 4)",
        courses: [
          { id: "de-701", code: "66771", name: "Power Plant Engineering", credits: 4.0, gradePoint: 4.0 },
          { id: "de-702", code: "66772", name: "Electrical Estimating & Costing", credits: 3.0, gradePoint: 4.0 },
          { id: "de-703", code: "66773", name: "PLC, Industrial Automation & Drives", credits: 4.0, gradePoint: 4.0 },
          { id: "de-704", code: "66774", name: "Project Work Phase-1", credits: 3.0, gradePoint: 4.0 },
          { id: "de-705", code: "65853", name: "Innovation & Entrepreneurship", credits: 2.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৮ম পর্ব (৪র্থ বর্ষ)",
        semesterNameEn: "8th Semester (Year 4)",
        courses: [
          { id: "de-801", code: "66781", name: "Industrial Attachment / In-Plant Training", credits: 12.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // 15. Diploma in Civil Technology (BTEB)
  diploma_civil: {
    key: "diploma_civil",
    category: "DIPLOMA",
    categoryLabelBn: "ডিপ্লোমা ইন ইঞ্জিনিয়ারিং (BTEB ৪ বছর মেয়াদি)",
    titleBn: "ডিপ্লোমা ইন সিভিল টেকনোলজি (কারিগরি বোর্ড - BTEB)",
    titleEn: "Diploma in Civil Technology (4-Year BTEB Curriculum)",
    typicalTotalCredits: 145,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম পর্ব (১ম বর্ষ)",
        semesterNameEn: "1st Semester (Year 1)",
        courses: [
          { id: "dc-101", code: "66411", name: "Civil Engineering Materials", credits: 3.0, gradePoint: 4.0 },
          { id: "dc-102", code: "66412", name: "Basic Civil Engineering Drawing", credits: 2.0, gradePoint: 4.0 },
          { id: "dc-103", code: "65911", name: "Mathematics-1", credits: 4.0, gradePoint: 3.75 },
          { id: "dc-104", code: "65912", name: "Physics-1", credits: 4.0, gradePoint: 3.5 },
          { id: "dc-105", code: "65711", name: "Bangla Literature & Language", credits: 3.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "২য় পর্ব (১ম বর্ষ)",
        semesterNameEn: "2nd Semester (Year 1)",
        courses: [
          { id: "dc-201", code: "66421", name: "Civil Engineering Workshop Practice", credits: 2.0, gradePoint: 4.0 },
          { id: "dc-202", code: "66422", name: "Surveying-1", credits: 4.0, gradePoint: 4.0 },
          { id: "dc-203", code: "65921", name: "Mathematics-2", credits: 4.0, gradePoint: 3.75 },
          { id: "dc-204", code: "65922", name: "Physics-2", credits: 4.0, gradePoint: 3.5 },
          { id: "dc-205", code: "65811", name: "Social Science", credits: 2.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "৩য় পর্ব (২য় বর্ষ)",
        semesterNameEn: "3rd Semester (Year 2)",
        courses: [
          { id: "dc-301", code: "66431", name: "Surveying-2", credits: 4.0, gradePoint: 4.0 },
          { id: "dc-302", code: "66432", name: "Construction Process-1", credits: 3.0, gradePoint: 4.0 },
          { id: "dc-303", code: "66433", name: "Civil Engineering Drawing CAD", credits: 2.0, gradePoint: 4.0 },
          { id: "dc-304", code: "65931", name: "Mathematics-3", credits: 4.0, gradePoint: 3.75 },
          { id: "dc-305", code: "65722", name: "Communicative English", credits: 3.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "৪র্থ পর্ব (২য় বর্ষ)",
        semesterNameEn: "4th Semester (Year 2)",
        courses: [
          { id: "dc-401", code: "66441", name: "Structural Mechanics", credits: 4.0, gradePoint: 4.0 },
          { id: "dc-402", code: "66442", name: "Construction Process-2", credits: 3.0, gradePoint: 3.75 },
          { id: "dc-403", code: "66443", name: "Civil Drafting using AutoCAD", credits: 2.0, gradePoint: 4.0 },
          { id: "dc-404", code: "66444", name: "Environmental Studies in Civil", credits: 3.0, gradePoint: 3.75 },
          { id: "dc-405", code: "65841", name: "Business Organization & Communication", credits: 2.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৫ম পর্ব (৩য় বর্ষ)",
        semesterNameEn: "5th Semester (Year 3)",
        courses: [
          { id: "dc-501", code: "66451", name: "Theory of Structures", credits: 4.0, gradePoint: 4.0 },
          { id: "dc-502", code: "66452", name: "Hydraulics & Fluid Flow", credits: 4.0, gradePoint: 3.75 },
          { id: "dc-503", code: "66453", name: "Soil Mechanics & Foundation", credits: 4.0, gradePoint: 3.75 },
          { id: "dc-504", code: "66454", name: "Water Supply Engineering", credits: 3.0, gradePoint: 4.0 },
          { id: "dc-505", code: "65851", name: "Accounting Theory & Practice", credits: 2.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৬ষ্ঠ পর্ব (৩য় বর্ষ)",
        semesterNameEn: "6th Semester (Year 3)",
        courses: [
          { id: "dc-601", code: "66461", name: "Design of Structure-1 (RCC)", credits: 4.0, gradePoint: 4.0 },
          { id: "dc-602", code: "66462", name: "Transportation Engineering-1 (Highways)", credits: 4.0, gradePoint: 4.0 },
          { id: "dc-603", code: "66463", name: "Sanitary Engineering & Waste Disposal", credits: 3.0, gradePoint: 3.75 },
          { id: "dc-604", code: "66464", name: "Civil Estimating & Costing-1", credits: 3.0, gradePoint: 4.0 },
          { id: "dc-605", code: "65852", name: "Industrial Management", credits: 2.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৭ম পর্ব (৪র্থ বর্ষ)",
        semesterNameEn: "7th Semester (Year 4)",
        courses: [
          { id: "dc-701", code: "66471", name: "Design of Structure-2 (Steel & Advanced RCC)", credits: 4.0, gradePoint: 4.0 },
          { id: "dc-702", code: "66472", name: "Transportation Engineering-2 (Bridges & Rail)", credits: 4.0, gradePoint: 4.0 },
          { id: "dc-703", code: "66473", name: "Civil Estimating & Costing-2", credits: 3.0, gradePoint: 4.0 },
          { id: "dc-704", code: "66474", name: "Construction Project Management", credits: 3.0, gradePoint: 4.0 },
          { id: "dc-705", code: "66475", name: "Project Work Phase-1", credits: 3.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৮ম পর্ব (৪র্থ বর্ষ)",
        semesterNameEn: "8th Semester (Year 4)",
        courses: [
          { id: "dc-801", code: "66481", name: "Industrial Attachment / Field Training", credits: 12.0, gradePoint: 4.0 },
        ],
      },
    ],
  },

  // 16. Diploma in Mechanical Technology (BTEB)
  diploma_mechanical: {
    key: "diploma_mechanical",
    category: "DIPLOMA",
    categoryLabelBn: "ডিপ্লোমা ইন ইঞ্জিনিয়ারিং (BTEB ৪ বছর মেয়াদি)",
    titleBn: "ডিপ্লোমা ইন মেকানিক্যাল টেকনোলজি (কারিগরি বোর্ড - BTEB)",
    titleEn: "Diploma in Mechanical Technology (4-Year BTEB Curriculum)",
    typicalTotalCredits: 145,
    semesters: [
      {
        semesterNumber: 1,
        semesterNameBn: "১ম পর্ব (১ম বর্ষ)",
        semesterNameEn: "1st Semester (Year 1)",
        courses: [
          { id: "dm-101", code: "67011", name: "Mechanical Engineering Materials", credits: 3.0, gradePoint: 4.0 },
          { id: "dm-102", code: "67012", name: "Engineering Drawing (Mechanical)", credits: 2.0, gradePoint: 4.0 },
          { id: "dm-103", code: "65911", name: "Mathematics-1", credits: 4.0, gradePoint: 3.75 },
          { id: "dm-104", code: "65912", name: "Physics-1", credits: 4.0, gradePoint: 3.5 },
          { id: "dm-105", code: "65711", name: "Bangla Literature & Language", credits: 3.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 2,
        semesterNameBn: "২য় পর্ব (১ম বর্ষ)",
        semesterNameEn: "2nd Semester (Year 1)",
        courses: [
          { id: "dm-201", code: "67021", name: "Machine Shop Practice-1 (Lathe & Shaper)", credits: 3.0, gradePoint: 4.0 },
          { id: "dm-202", code: "67022", name: "Foundry & Welding Shop Practice", credits: 2.0, gradePoint: 4.0 },
          { id: "dm-203", code: "65921", name: "Mathematics-2", credits: 4.0, gradePoint: 3.75 },
          { id: "dm-204", code: "65922", name: "Physics-2", credits: 4.0, gradePoint: 3.5 },
          { id: "dm-205", code: "65811", name: "Social Science", credits: 2.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 3,
        semesterNameBn: "৩য় পর্ব (২য় বর্ষ)",
        semesterNameEn: "3rd Semester (Year 2)",
        courses: [
          { id: "dm-301", code: "67031", name: "Machine Shop Practice-2 (Milling & Grinding)", credits: 3.0, gradePoint: 4.0 },
          { id: "dm-302", code: "67032", name: "Engineering Mechanics (Statics & Dynamics)", credits: 4.0, gradePoint: 3.75 },
          { id: "dm-303", code: "67033", name: "CAD in Mechanical Drawing", credits: 2.0, gradePoint: 4.0 },
          { id: "dm-304", code: "65931", name: "Mathematics-3", credits: 4.0, gradePoint: 3.75 },
          { id: "dm-305", code: "65722", name: "Communicative English", credits: 3.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 4,
        semesterNameBn: "৪র্থ পর্ব (২য় বর্ষ)",
        semesterNameEn: "4th Semester (Year 2)",
        courses: [
          { id: "dm-401", code: "67041", name: "Thermodynamics & Heat Engines", credits: 4.0, gradePoint: 4.0 },
          { id: "dm-402", code: "67042", name: "Mechanics of Materials", credits: 4.0, gradePoint: 3.75 },
          { id: "dm-403", code: "67043", name: "Manufacturing Processes", credits: 3.0, gradePoint: 4.0 },
          { id: "dm-404", code: "66744", name: "Electrical Circuits & Machines", credits: 3.0, gradePoint: 3.5 },
          { id: "dm-405", code: "65841", name: "Business Communication", credits: 2.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 5,
        semesterNameBn: "৫ম পর্ব (৩য় বর্ষ)",
        semesterNameEn: "5th Semester (Year 3)",
        courses: [
          { id: "dm-501", code: "67051", name: "Fluid Mechanics & Hydraulic Machinery", credits: 4.0, gradePoint: 4.0 },
          { id: "dm-502", code: "67052", name: "Internal Combustion (IC) Engines", credits: 4.0, gradePoint: 4.0 },
          { id: "dm-503", code: "67053", name: "Refrigeration & Air Conditioning (RAC)", credits: 4.0, gradePoint: 4.0 },
          { id: "dm-504", code: "67054", name: "Advanced Welding Technology", credits: 2.0, gradePoint: 3.75 },
          { id: "dm-505", code: "65851", name: "Accounting Theory & Practice", credits: 2.0, gradePoint: 3.5 },
        ],
      },
      {
        semesterNumber: 6,
        semesterNameBn: "৬ষ্ঠ পর্ব (৩য় বর্ষ)",
        semesterNameEn: "6th Semester (Year 3)",
        courses: [
          { id: "dm-601", code: "67061", name: "Machine Design & Stress Analysis", credits: 4.0, gradePoint: 4.0 },
          { id: "dm-602", code: "67062", name: "Power Plant Engineering", credits: 4.0, gradePoint: 4.0 },
          { id: "dm-603", code: "67063", name: "Automobile Engineering & Maintenance", credits: 4.0, gradePoint: 4.0 },
          { id: "dm-604", code: "67064", name: "Mechanical Estimating & Costing", credits: 3.0, gradePoint: 3.75 },
          { id: "dm-605", code: "65852", name: "Industrial Management", credits: 2.0, gradePoint: 3.75 },
        ],
      },
      {
        semesterNumber: 7,
        semesterNameBn: "৭ম পর্ব (৪র্থ বর্ষ)",
        semesterNameEn: "7th Semester (Year 4)",
        courses: [
          { id: "dm-701", code: "67071", name: "CNC Machine Programming & CAM", credits: 4.0, gradePoint: 4.0 },
          { id: "dm-702", code: "67072", name: "Industrial Pneumatics & Hydraulics (Automation)", credits: 4.0, gradePoint: 4.0 },
          { id: "dm-703", code: "67073", name: "Tool Design & Quality Control", credits: 3.0, gradePoint: 4.0 },
          { id: "dm-704", code: "67074", name: "Project Work Phase-1", credits: 3.0, gradePoint: 4.0 },
          { id: "dm-705", code: "65853", name: "Innovation & Entrepreneurship", credits: 2.0, gradePoint: 4.0 },
        ],
      },
      {
        semesterNumber: 8,
        semesterNameBn: "৮ম পর্ব (৪র্থ বর্ষ)",
        semesterNameEn: "8th Semester (Year 4)",
        courses: [
          { id: "dm-801", code: "67081", name: "Industrial Attachment / Factory In-Plant Training", credits: 12.0, gradePoint: 4.0 },
        ],
      },
    ],
  },
`;

const targetAnchor = '  },\n};';
const index = content.lastIndexOf(targetAnchor);

if (index === -1) {
  console.error("Could not find anchor '  },\\n};'");
  process.exit(1);
}

const updatedContent = content.slice(0, index + 4) + newPrograms + content.slice(index + 4);
fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log('Successfully added 12 new Bangladeshi degree programs to cgpa-grade-engine.ts');
