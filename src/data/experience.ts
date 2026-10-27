// Canonical career data, taken from the owner's CV (IT CV 2026 v3.1, public/cv/) plus the
// current Aiyaar Ltd role the owner confirmed. Resume and /experience both read from here.

export const CV_PDF = "/cv/Md-Sabbirul-Islam-Khan-CV-2026.pdf";
export const LINKEDIN_URL = "https://www.linkedin.com/in/thesabbirbd/";

export const HEADLINE = "Aspiring Backend & DevOps Engineer";
export const FOCUS_LINE = "IT Support • NOC • Linux • Networking • Python • AI-Assisted Projects";

export const SUMMARY =
  "Management student and aspiring Backend & DevOps Engineer with practical experience in IT support and NOC-oriented technical environments, plus growing exposure to Linux, networking, Python, Docker, backend technologies and AI-assisted project development. Strongest in troubleshooting, technical support, networking and systems; backend and DevOps are the main growth direction.";

export type WorkItem = {
  title: string;
  org: string;
  url?: string;
  date: string;
  current?: boolean;
  kind: "leadership" | "it" | "training" | "research" | "media" | "build";
  points: string[];
};

export const CURRENT_ROLE = {
  title: "Chief Project Manager (CPM)",
  org: "Aiyaar Ltd",
  url: "https://aiyaar.ltd",
};

export const WORK_EXPERIENCE: WorkItem[] = [
  {
    title: CURRENT_ROLE.title,
    org: CURRENT_ROLE.org,
    url: CURRENT_ROLE.url,
    date: "Current",
    current: true,
    kind: "leadership",
    points: ["Chief Project Manager at Aiyaar Ltd — project planning, coordination and delivery."],
  },
  {
    title: "Creator & Solo Developer (Open Source)",
    org: "Omnidesk BD",
    url: "/projects/omnidesk",
    date: "2026 – Present",
    current: true,
    kind: "build",
    points: [
      "Building a local-first learning workspace: FastAPI + PostgreSQL backend, document ingestion, a visual DAG roadmap and a Gemini → Ollama → offline AI cascade, containerised with Docker.",
    ],
  },
  {
    title: "IT Support",
    org: "Shunno IT",
    url: "https://www.facebook.com/ShunnoITBD",
    date: "Aug 2025 – Nov 2025",
    kind: "it",
    points: [
      "Delivered L1/L2 software support for the “Netfee” ISP billing and management platform, resolving tickets by phone, email and chat.",
      "Assisted NOC staff with basic network troubleshooting, link-failure diagnostics and customer connection issues.",
    ],
  },
  {
    title: "CES Field Interviewer (EPI)",
    org: "Center for Social and Market Research (CSMR)",
    date: "Dec 2023 – Feb 2025",
    kind: "research",
    points: [
      "Ran Expanded Program on Immunization (EPI) coverage evaluation surveys — collecting, digitising and analysing public-health data.",
      "Worked with field supervisors and health officials to keep data integrity and follow survey protocols.",
    ],
  },
  {
    title: "Content Creator",
    org: "Aditi",
    url: "https://www.facebook.com/aditi.aditibd",
    date: "Feb 2024 – May 2024",
    kind: "media",
    points: ["Produced and edited visual media for digital marketing campaigns and brand storytelling."],
  },
  {
    title: "Python Programming Trainee",
    org: "Bangladesh Hi-Tech Park Authority",
    date: "2023 – 2024",
    kind: "training",
    points: ["Structured Python training: core logic, data structures, automation scripts and software-development fundamentals."],
  },
  {
    title: "Technical Support Specialist",
    org: "MR Computer",
    date: "May 2021 – Jun 2022",
    kind: "it",
    points: [
      "Diagnosed and repaired hardware failures, operating-system errors and LAN connectivity issues on desktop computers.",
      "Installed and maintained operating systems, software and peripherals for individual and commercial clients.",
    ],
  },
];

export const EDUCATION = [
  {
    degree: "Bachelor of Business Administration (Management)",
    institution: "Rajshahi College",
    date: "2021 – Expected 2026",
    note: "4th year running (session 2021–22)",
  },
  {
    degree: "HSC — Business Administration",
    institution: "Hat Gangopara B.M College",
    date: "Feb 2022",
    note: "GPA 5.00 / 5.00 · Specialisation: Computer Operations",
  },
  {
    degree: "SSC — Science",
    institution: "Hat Gangopara B.M College",
    date: "Feb 2019",
    note: "GPA 4.68 / 5.00 · Trade: General Electronics",
  },
];

export const TRAINING = [
  { name: "AI in Immersive Technology, Level-6 (360 hours)", org: "National Skills Development Authority (NSDA)", date: "Feb 2026" },
  { name: "Research Methodology", org: "Rajshahi College Research Community (RCRC)", date: "May 2025" },
  { name: "Introduction to Python", org: "Bangladesh Hi-Tech Park Authority", date: "2023 – 2024" },
  { name: "National Skill Standard Basic 360", org: "Bangladesh Technical Education Board (BTEB)", date: "Jan 2019" },
];

export const LANGUAGES = [
  { name: "Bengali", level: "Native" },
  { name: "English", level: "Professional working proficiency" },
  { name: "Hindi", level: "Conversational" },
];
