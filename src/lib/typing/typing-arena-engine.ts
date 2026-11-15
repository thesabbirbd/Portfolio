/**
 * THE SABBiR OS — Typing Speed Arena Engine
 * Curates 4 typing tracks: Bangla Unicode, English Executive Prose, Code, and Linux CLI.
 * Calculates Gross WPM, Net WPM, Accuracy %, and Consistency score.
 */

export interface TypingPassage {
  id: string;
  track: "bangla" | "english" | "code" | "cli";
  title: string;
  text: string;
  difficulty: "Easy" | "Medium" | "Pro";
}

export const TYPING_PASSAGES: TypingPassage[] = [
  // 1. Bangla Unicode Track
  {
    id: "bn-gov-constitution",
    track: "bangla",
    title: "বাংলাদেশের সংবিধান ও নাগরিক কর্তব্য",
    text: "প্রজাতন্ত্রের সকল ক্ষমতার মালিক জনগণ এবং জনগণের পক্ষে সেই ক্ষমতার প্রয়োগ কেবল সংবিধানের অধীন ও কর্তৃত্বে কার্যকর হইবে। আইনের দৃষ্টিতে সকল নাগরিক সমান এবং সকলেই আইনের সমান আশ্রয় লাভের অধিকারী।",
    difficulty: "Medium",
  },
  {
    id: "bn-tech-growth",
    track: "bangla",
    title: "ডিজিটাল বাংলাদেশ ও উদ্ভাবন",
    text: "সফটওয়্যার ও তথ্যপ্রযুক্তি খাতে তরুণ প্রজন্মের মেধা ও কঠোর পরিশ্রমের ফলে দেশীয় স্টার্টআপ ইকোসিস্টেম প্রতিনিয়ত সমৃদ্ধ হচ্ছে। ক্লাউড কম্পিউটিং এবং কৃত্রিম বুদ্ধিমত্তা ব্যবহারের মাধ্যমে নাগরিক সেবা আরও সহজ ও স্বচ্ছ হচ্ছে।",
    difficulty: "Easy",
  },
  {
    id: "bn-prose-literature",
    track: "bangla",
    title: "বাংলা সাহিত্যের সৌন্দর্য ও ছন্দ",
    text: "আমাদের ভাষা আমাদের আত্মপরিচয়ের প্রতীক। একুশের রক্তঝরা ইতিহাস থেকে শুরু করে আজকের বৈশ্বিক পরিমণ্ডলে বাংলা ভাষার সাহিত্য ও সংস্কৃতির ঐতিহ্য অনন্য মর্যাদায় প্রতিষ্ঠিত হয়েছে।",
    difficulty: "Pro",
  },

  // 2. English Executive Prose Track
  {
    id: "en-system-architecture",
    track: "english",
    title: "Enterprise Systems Architecture",
    text: "Designing resilient distributed systems requires careful trade-offs between consistency, availability, and network partition tolerance. Modern edge computing minimizes latency by executing application logic near the client.",
    difficulty: "Medium",
  },
  {
    id: "en-product-craft",
    track: "english",
    title: "The Craft of Product Engineering",
    text: "Great user experiences emerge at the intersection of aesthetic restraint and rigorous performance engineering. When interfaces respond instantaneously with physical tactile feedback, users feel in complete control.",
    difficulty: "Easy",
  },
  {
    id: "en-leadership-strategy",
    track: "english",
    title: "Strategic Velocity & Execution",
    text: "High-performing engineering teams prioritize ruthless simplicity over premature architectural complexity. Shipping incremental production milestones builds compounding momentum that outpaces bloated roadmaps.",
    difficulty: "Pro",
  },

  // 3. Code Track (TS, Python, SQL)
  {
    id: "code-typescript-promise",
    track: "code",
    title: "TypeScript Concurrent Task Queue",
    text: "async function executeBatch<T>(tasks: (() => Promise<T>)[], concurrency: number): Promise<T[]> { const results: T[] = []; for (let i = 0; i < tasks.length; i += concurrency) { const chunk = await Promise.all(tasks.slice(i, i + concurrency).map(t => t())); results.push(...chunk); } return results; }",
    difficulty: "Pro",
  },
  {
    id: "code-sql-aggregation",
    track: "code",
    title: "PostgreSQL Window Aggregation",
    text: "SELECT user_id, action, COUNT(*) OVER (PARTITION BY user_id ORDER BY created_at RANGE BETWEEN INTERVAL '1 day' PRECEDING AND CURRENT ROW) AS daily_actions FROM security_audit_logs WHERE threat_level = 'critical';",
    difficulty: "Medium",
  },

  // 4. Linux CLI Track
  {
    id: "cli-docker-systemctl",
    track: "cli",
    title: "Linux DevOps & Docker Diagnostics",
    text: "sudo systemctl status postgresql.service && docker compose up -d --build && journalctl -u nginx.service -f -n 50 && netstat -tulnp | grep :3000",
    difficulty: "Medium",
  },
  {
    id: "cli-git-network",
    track: "cli",
    title: "Git Rebase & MikroTik Traffic Probe",
    text: "git checkout -b feature/kernel-waf && git commit -am 'feat: ast inspection' && ping -c 5 1.1.1.1 && traceroute sabbir.nav.bd",
    difficulty: "Easy",
  },
];

export interface TypingMetrics {
  grossWpm: number;
  netWpm: number;
  accuracyPercent: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
  errorKeystrokes: number;
  elapsedSeconds: number;
}

export function calculateTypingMetrics(
  typedText: string,
  targetText: string,
  elapsedSeconds: number
): TypingMetrics {
  const safeSeconds = Math.max(1, elapsedSeconds);
  const minutes = safeSeconds / 60;

  let correctKeystrokes = 0;
  let errorKeystrokes = 0;

  for (let i = 0; i < typedText.length; i++) {
    if (i < targetText.length && typedText[i] === targetText[i]) {
      correctKeystrokes++;
    } else {
      errorKeystrokes++;
    }
  }

  const totalKeystrokes = typedText.length;
  // Standard metric: 1 word = 5 characters
  const grossWpm = Math.round(totalKeystrokes / 5 / minutes);
  const netWpm = Math.max(0, Math.round(grossWpm - errorKeystrokes / minutes));
  const accuracyPercent =
    totalKeystrokes > 0
      ? Number(((correctKeystrokes / totalKeystrokes) * 100).toFixed(1))
      : 100;

  return {
    grossWpm,
    netWpm,
    accuracyPercent,
    totalKeystrokes,
    correctKeystrokes,
    errorKeystrokes,
    elapsedSeconds: safeSeconds,
  };
}
