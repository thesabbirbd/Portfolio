export interface SandboxFile {
  name: string;
  lang: string;
  code: string;
}

export interface ProjectSandboxData {
  githubRepoName: string;
  cliCommand: string;
  liveOutput: string;
  files: SandboxFile[];
}

export const PROJECT_SANDBOXES: Record<string, ProjectSandboxData> = {
  "omnidesk": {
    githubRepoName: "Omnidesk-BD",
    cliCommand: "npx omnidesk-bd@latest --graph topic-dag.json",
    liveOutput: "[DAG_LOAD] Parsed 42 learning nodes with 68 directed dependency edges.\n[AI_CASCADE] Tier 1: Gemini Free -> Tier 2: Ollama Local (qwen2.5:0.5b) -> Tier 3: Offline Heuristic.\n[STATUS] Ready. Serving local UI on http://localhost:8080",
    files: [
      {
        name: "main.py",
        lang: "python",
        code: `from fastapi import FastAPI
from omnidesk.engine import TopicGraphEngine, AICascade

app = FastAPI(title="Omnidesk BD Core", version="5.2.10")
engine = TopicGraphEngine(storage_mode="local_sqlite")

@app.get("/api/v1/roadmap")
async def get_roadmap(topic: str):
    graph = await engine.build_verified_dag(topic)
    return {"nodes": graph.node_count, "edges": graph.edge_count, "hash": graph.sha256}
`,
      },
      {
        name: "cascade.py",
        lang: "python",
        code: `class AICascade:
    async def evaluate_node(self, prompt: str):
        try:
            return await self.call_gemini_free(prompt)
        except Exception:
            return await self.call_local_ollama(prompt, model="qwen2.5:0.5b")
`,
      },
    ],
  },
  "khata2sheet-ai": {
    githubRepoName: "khata2sheet-ai",
    cliCommand: "python -m khata2sheet.cli sample_memo.jpg --export excel",
    liveOutput: "[CV] Grayscale applied. Otsu threshold calculated (T=142).\n[CONTOURS] Detected ledger table borders. Deskew corrected +1.4°.\n[OCR] Bengali numerals recognized: ৯,৭৫০.০০ ৳ and ১২,৫০০.০০ ৳.\n[EXPORT] Exported verified reconciliation to baki_reconciliation.xlsx (12 rows).",
    files: [
      {
        name: "pipeline.py",
        lang: "python",
        code: `import cv2
import numpy as np

def preprocess_khata_scan(image_path: str):
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    blurred = cv2.GaussianBlur(img, (5, 5), 0)
    thresh = cv2.adaptiveThreshold(
        blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )
    return thresh
`,
      },
      {
        name: "bengali_digits.py",
        lang: "python",
        code: `BENGALI_TO_ASCII = str.maketrans("০১২৩৪৫৬৭৮৯", "0123456789")

def parse_taka_amount(bengali_str: str) -> float:
    ascii_clean = bengali_str.translate(BENGALI_TO_ASCII).replace(",", "")
    return float(ascii_clean)
`,
      },
    ],
  },
  "sara-control-plane": {
    githubRepoName: "sara-control-plane",
    cliCommand: "python -m sara.daemon --poll-interval 1.0",
    liveOutput: "[AUTH] Verified admin Telegram User ID (HMAC-SHA256 Match).\n[QUEUE] SQLite WAL initialized at /var/lib/sara/jobs.db. Pending jobs: 0.\n[DAEMON] Background health telemetry loop started (Ping rate: 60s).\n[SYS] Memory: 3.2GB/14GB, CPU: 4.1%, Disk: 48% OK.",
    files: [
      {
        name: "orchestrator.py",
        lang: "python",
        code: `import sqlite3
import asyncio

class TaskQueue:
    def __init__(self, db_path: str = "jobs.db"):
        self.conn = sqlite3.connect(db_path, isolation_level=None)
        self.conn.execute("PRAGMA journal_mode=WAL")
        self.conn.execute("CREATE TABLE IF NOT EXISTS jobs (id TEXT PRIMARY KEY, cmd TEXT, status TEXT)")
`,
      },
    ],
  },
  "wa-reminder-companion": {
    githubRepoName: "wa-reminder-companion",
    cliCommand: "python -m wa_companion.cli --due-days 7 --dry-run",
    liveOutput: "[POS_SYNC] 18 pending invoices due >7 days found in pharmacy SQLite database.\n[HUMAN_JITTER] Scheduled dispatch window: 10:00 AM - 12:30 PM with 15s-45s random spacing.\n[SAFE_DRY_RUN] Generated 18 personalized Bangla WhatsApp messages without hitting network.\n[AUDIT] Zero duplicate messages allowed by IdempotencyKey SHA256.",
    files: [
      {
        name: "dispatcher.py",
        lang: "python",
        code: `import time
import random

def dispatch_reminder(customer: str, amount_due: float, dry_run: bool = True):
    jitter = random.uniform(15.0, 45.0)
    print(f"Holding for {jitter:.1f}s jitter before notifying {customer}...")
    if not dry_run:
        # headless browser dispatch
        pass
`,
      },
    ],
  },
  "netpulse-tg": {
    githubRepoName: "netpulse-tg",
    cliCommand: "netpulse-probe --target 8.8.8.8,1.1.1.1 --interval 0.5s",
    liveOutput: "[PROBE] Primary WAN (192.168.88.1) Latency: 12.4ms, Jitter: 0.8ms, Loss: 0.0%.\n[METRICS] Exporting Prometheus counters on :9100/metrics.\n[WATCHDOG] Outage detection threshold: 4 dropped probes. Link state: HEALTHY.",
    files: [
      {
        name: "probe.py",
        lang: "python",
        code: `import subprocess
import time

def ping_gateway(host: str = "8.8.8.8", count: int = 3):
    cmd = ["ping", "-c", str(count), "-W", "1", host]
    res = subprocess.run(cmd, capture_output=True, text=True)
    return res.returncode == 0
`,
      },
    ],
  },
  "bd-biz-normalizer": {
    githubRepoName: "bd-biz-normalizer",
    cliCommand: "bd-normalize batch input_customers.csv --out clean_customers.csv",
    liveOutput: "[BATCH] Processed 10,000 raw SME customer rows in 198ms (50,505 rec/s).\n[TELCO] Operators classified: GP: 4,420, BL: 2,890, Robi: 1,810, Teletalk: 880.\n[GEO] 64 district spellings resolved (e.g. 'ctg' -> 'Chattogram', 'cumilla' -> 'Cumilla').\n[INTEGRITY] 0 fatal schema errors.",
    files: [
      {
        name: "phone.py",
        lang: "python",
        code: `import re

OPERATOR_PREFIXES = {
    "17": "Grameenphone", "13": "Grameenphone",
    "19": "Banglalink",   "14": "Banglalink",
    "18": "Robi",         "16": "Airtel",
    "15": "Teletalk",
}

def normalize_bd_phone(raw: str) -> dict:
    digits = re.sub(r'\\D', '', raw)
    if digits.startswith("880"):
        digits = digits[3:]
    elif digits.startswith("0"):
        digits = digits[1:]
    prefix = digits[:2]
    return {
        "e164": f"+880{digits}",
        "operator": OPERATOR_PREFIXES.get(prefix, "Unknown"),
        "valid": len(digits) == 10 and prefix in OPERATOR_PREFIXES
    }
`,
      },
    ],
  },
  "scannable-barcode-qr-bd": {
    githubRepoName: "scannable-barcode-qr-bd",
    cliCommand: "npx scannable-barcode-qr-bd --format code128 --value 'INV-2026-9042'",
    liveOutput: "[CODE128] Encoded value 'INV-2026-9042' with Start-B 104 and Modulo-103 Checksum.\n[QR] Generated ISO/IEC 18004 matrix with Reed-Solomon Error Correction Level M.\n[TEST] Self-test verified 100% scannability against standard scanner patterns.",
    files: [
      {
        name: "barcode.ts",
        lang: "typescript",
        code: `import { encodeCode128B } from "./code128-encoder";
import { generateQrMatrix } from "./qr-matrix-encoder";

export function generateScannableAssets(sku: string) {
  const barcode = encodeCode128B(sku);
  const qr = generateQrMatrix(\`https://sabbir.nav.bd/item/\${sku}\`);
  return { barcode, qr };
}
`,
      },
    ],
  },
  "bd-taka-words-ocr": {
    githubRepoName: "bd-taka-words-ocr",
    cliCommand: "npx bd-taka-words-ocr --amount 125450",
    liveOutput: "[TAKA_BD] Input: 125,450 ৳\n[BANGLA] এক লক্ষ পঁচিশ হাজার চারশত পঞ্চাশ টাকা মাত্র\n[ENGLISH] One Lakh Twenty-Five Thousand Four Hundred Fifty Taka Only\n[AUDIT] Cheque verification status: MATCHED (0 discrepancies).",
    files: [
      {
        name: "taka.ts",
        lang: "typescript",
        code: `import { takaInBanglaWords, takaInEnglishWords } from "./taka-in-words";

const amount = 125450;
console.log(takaInBanglaWords(amount)); // এক লক্ষ পঁচিশ হাজার চারশত পঞ্চাশ টাকা মাত্র
console.log(takaInEnglishWords(amount)); // One Lakh Twenty-Five Thousand Four Hundred Fifty Taka Only
`,
      },
    ],
  },
};
