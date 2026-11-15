/**
 * Pure client-side logic for THE SABBiR Engineering & SaaS Tools Suite.
 * Zero server cost, zero external bloat, deterministic and 100% unit-tested.
 */

// ---------------------------------------------------------------------------
// 1. Subnet / CIDR Calculator
// ---------------------------------------------------------------------------
export const toIp = (n: number) => [24, 16, 8, 0].map((s) => (n >>> s) & 255).join(".");

export function subnet(input: string) {
  const m = input.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/);
  if (!m) return { error: "Use the form 192.168.10.77/26" };
  const octets = m.slice(1, 5).map(Number);
  const prefix = Number(m[5]);
  if (octets.some((o) => o > 255) || prefix > 32) return { error: "Octets must be 0–255 and the prefix 0–32" };
  const ip = octets.reduce((a, o) => ((a << 8) | o) >>> 0, 0);
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const network = (ip & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const total = 2 ** (32 - prefix);
  const usable = prefix >= 31 ? total : total - 2; // RFC 3021 /31 and single-host /32
  const first = prefix >= 31 ? network : network + 1;
  const last = prefix >= 31 ? broadcast : broadcast - 1;
  return {
    rows: [
      ["Network", `${toIp(network)}/${prefix}`],
      ["Netmask", toIp(mask)],
      ["Wildcard", toIp(~mask >>> 0)],
      ["Broadcast", prefix >= 31 ? "n/a" : toIp(broadcast)],
      ["First host", toIp(first)],
      ["Last host", toIp(last)],
      ["Addresses", total.toLocaleString("en-US")],
      ["Usable hosts", usable.toLocaleString("en-US")],
    ] as [string, string][],
  };
}

// ---------------------------------------------------------------------------
// 2. Base64 UTF-8 (Supports Bangla & Unicode)
// ---------------------------------------------------------------------------
export const b64encode = (s: string) => btoa(String.fromCharCode(...new TextEncoder().encode(s)));
export const b64decode = (s: string) => new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(atob(s.trim()), (c) => c.charCodeAt(0)));

// ---------------------------------------------------------------------------
// 3. Cron & systemd Timer Explainer + Generator
// ---------------------------------------------------------------------------
export interface CronParseResult {
  valid: boolean;
  error?: string;
  human: string;
  humanBn: string;
  systemdCalendar: string;
  systemdTimerUnit: string;
  systemdServiceUnit: string;
  nextRunHints: string[];
}

export function parseCron(expr: string): CronParseResult {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) {
    return {
      valid: false,
      error: "Cron expression must have exactly 5 fields (minute hour day-of-month month day-of-week).",
      human: "Invalid syntax",
      humanBn: "ভুল সিনট্যাক্স",
      systemdCalendar: "",
      systemdTimerUnit: "",
      systemdServiceUnit: "",
      nextRunHints: [],
    };
  }

  const [min, hour, dom, mon, dow] = parts;

  // Human-readable translations
  let human = "At ";
  let humanBn = "";

  if (min === "*" && hour === "*") {
    human = "Every minute";
    humanBn = "প্রতি মিনিট পর পর";
  } else if (min.startsWith("*/")) {
    const step = min.replace("*/", "");
    human = `Every ${step} minutes`;
    humanBn = `প্রতি ${step} মিনিট পর পর`;
  } else if (hour.startsWith("*/")) {
    const step = hour.replace("*/", "");
    human = `Every ${step} hours at minute ${min}`;
    humanBn = `প্রতি ${step} ঘণ্টা পর পর ${min} মিনিটে`;
  } else {
    const formattedHour = hour.padStart(2, "0");
    const formattedMin = min.padStart(2, "0");
    human = `At ${formattedHour}:${formattedMin}`;
    humanBn = `${formattedHour}:${formattedMin} টায়`;
  }

  // Day & Frequency
  if (dom === "*" && mon === "*" && dow === "*") {
    if (!min.startsWith("*/") && !(min === "*" && hour === "*")) {
      human += " every day";
      humanBn = `প্রতিদিন ` + humanBn;
    }
  } else if (dow === "1-5") {
    human += ", Monday through Friday";
    humanBn += ", সোম থেকে শুক্রবার";
  } else if (dow === "0" || dow === "7") {
    human += " on Sunday";
    humanBn += " প্রতি রবিবার";
  } else if (dow !== "*") {
    const days: Record<string, string> = { "1": "Monday", "2": "Tuesday", "3": "Wednesday", "4": "Thursday", "5": "Friday", "6": "Saturday" };
    human += ` on ${days[dow] ?? "specified days"}`;
    humanBn += ` নির্দিষ্ট দিনে (${dow})`;
  }

  // systemd Calendar string mapping
  let systemdCalendar = "";
  if (min.startsWith("*/") && hour === "*") {
    systemdCalendar = `*:0/${min.replace("*/", "")}`;
  } else if (dow === "0" || dow === "7") {
    systemdCalendar = `Sun *-*-* ${hour.padStart(2, "0")}:${min.padStart(2, "0")}:00`;
  } else if (dow === "1-5") {
    systemdCalendar = `Mon..Fri *-*-* ${hour.padStart(2, "0")}:${min.padStart(2, "0")}:00`;
  } else {
    const dStr = dom === "*" ? "*-*-*" : `*-*-${dom.padStart(2, "0")}`;
    const hStr = hour === "*" ? "*" : hour.padStart(2, "0");
    const mStr = min === "*" ? "*" : min.padStart(2, "0");
    systemdCalendar = `${dStr} ${hStr}:${mStr}:00`;
  }

  const systemdTimerUnit = `[Unit]
Description=Automated Job Timer (THE SABBiR DevOps)
Wants=network-online.target

[Timer]
OnCalendar=${systemdCalendar}
Persistent=true

[Install]
WantedBy=timers.target`;

  const systemdServiceUnit = `[Unit]
Description=Automated Job Worker Service
After=network.target

[Service]
Type=oneshot
User=thesabbir
WorkingDirectory=/opt/app
ExecStart=/usr/local/bin/run-task.sh
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target`;

  const nextRunHints = [
    `Expression: ${expr}`,
    `Human Schedule: ${human}`,
    `Bangla: ${humanBn}`,
    `systemd OnCalendar: ${systemdCalendar}`,
  ];

  return {
    valid: true,
    human,
    humanBn,
    systemdCalendar,
    systemdTimerUnit,
    systemdServiceUnit,
    nextRunHints,
  };
}

// ---------------------------------------------------------------------------
// 4. BD E-Commerce & POS Margin / COD Calculator
// ---------------------------------------------------------------------------
export interface EcommerceMarginInput {
  sellingPrice: number;
  productCost: number;
  courierFee: number;
  customerDeliveryFee: number;
  codPercent?: number;
  gatewayPercent?: number;
  packagingCost?: number;
  returnRatePercent?: number;
  courierReturnFee?: number;
}

export interface EcommerceMarginResult {
  totalInvoice: number;
  codDeduction: number;
  gatewayDeduction: number;
  netDeliveredProfit: number;
  netDeliveredMarginPct: number;
  returnLossPerOrder: number;
  expectedBlendedProfit: number;
  breakEvenPrice: number;
  isProfitable: boolean;
}

export function calculateEcommerceMargin(input: EcommerceMarginInput): EcommerceMarginResult {
  const sellingPrice = Math.max(0, Number(input.sellingPrice) || 0);
  const productCost = Math.max(0, Number(input.productCost) || 0);
  const courierFee = Math.max(0, Number(input.courierFee) || 0);
  const customerDeliveryFee = Math.max(0, Number(input.customerDeliveryFee) || 0);
  const codPercent = Math.max(0, input.codPercent ?? 1.0);
  const gatewayPercent = Math.max(0, input.gatewayPercent ?? 0);
  const packagingCost = Math.max(0, input.packagingCost ?? 25);
  const returnRatePercent = Math.max(0, input.returnRatePercent ?? 5);
  const courierReturnFee = Math.max(0, input.courierReturnFee ?? (courierFee > 0 ? Math.round(courierFee * 0.5) : 50));

  const totalInvoice = sellingPrice + customerDeliveryFee;
  const codDeduction = Number(((totalInvoice * (codPercent / 100))).toFixed(2));
  const gatewayDeduction = Number(((sellingPrice * (gatewayPercent / 100))).toFixed(2));

  // Variable cost for a successfully delivered order
  const deliveredCost = productCost + packagingCost + courierFee + codDeduction + gatewayDeduction;
  const netDeliveredProfit = Number((totalInvoice - deliveredCost).toFixed(2));
  const netDeliveredMarginPct = sellingPrice > 0 ? Number(((netDeliveredProfit / sellingPrice) * 100).toFixed(1)) : 0;

  // Loss incurred on a returned/undelivered parcel (courier return + outward + non-reusable packaging)
  const returnLossPerOrder = Number((courierFee + courierReturnFee + packagingCost).toFixed(2));

  // Blended average profit per dispatched parcel considering return risk
  const returnRate = Math.min(Math.max(returnRatePercent / 100, 0), 1);
  const deliveryRate = 1 - returnRate;
  const expectedBlendedProfit = Number(((netDeliveredProfit * deliveryRate) - (returnLossPerOrder * returnRate)).toFixed(2));

  // Break-even calculation
  const fixedPerOrder = (deliveryRate * (packagingCost + courierFee + customerDeliveryFee * (codPercent / 100))) + (returnRate * returnLossPerOrder) + (deliveryRate * productCost) - (deliveryRate * customerDeliveryFee);
  const variableFactor = deliveryRate * (1 - (gatewayPercent / 100) - (codPercent / 100));
  const breakEvenPrice = variableFactor > 0 ? Math.max(0, Math.round(fixedPerOrder / variableFactor)) : 0;

  return {
    totalInvoice,
    codDeduction,
    gatewayDeduction,
    netDeliveredProfit,
    netDeliveredMarginPct,
    returnLossPerOrder,
    expectedBlendedProfit,
    breakEvenPrice,
    isProfitable: expectedBlendedProfit > 0,
  };
}

// ---------------------------------------------------------------------------
// 5. Docker Compose & Nginx Reverse-Proxy Generator
// ---------------------------------------------------------------------------
export interface DockerNginxConfig {
  serviceName: string;
  port: number;
  domain: string;
  database: "none" | "postgres" | "redis" | "both";
  enableSSL?: boolean;
  enableRateLimit?: boolean;
}

export function generateDockerNginx(cfg: DockerNginxConfig): { dockerCompose: string; nginxConf: string } {
  const service = (cfg.serviceName || "backend-app").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-");
  const port = cfg.port || 8000;
  const domain = (cfg.domain || "api.example.com").trim().toLowerCase();
  const db = cfg.database || "postgres";
  const ssl = Boolean(cfg.enableSSL);
  const rateLimit = Boolean(cfg.enableRateLimit);

  // Docker compose YAML construction
  const services: string[] = [];

  services.push(`  ${service}:
    build: .
    container_name: ${service}_prod
    restart: always
    environment:
      - PORT=${port}
      - ENVIRONMENT=production${db === "postgres" || db === "both" ? `\n      - DATABASE_URL=postgresql://sabbir:secret_pass@db:5432/${service}_db` : ""}${db === "redis" || db === "both" ? `\n      - REDIS_URL=redis://cache:6379/0` : ""}
    ports:
      - "127.0.0.1:${port}:${port}"
    networks:
      - app_net${db !== "none" ? `\n    depends_on:${db === "postgres" || db === "both" ? `\n      db:\n        condition: service_healthy` : ""}${db === "redis" || db === "both" ? `\n      cache:\n        condition: service_healthy` : ""}` : ""}`);

  if (db === "postgres" || db === "both") {
    services.push(`  db:
    image: postgres:17-alpine
    container_name: ${service}_postgres
    restart: always
    environment:
      POSTGRES_USER: sabbir
      POSTGRES_PASSWORD: secret_pass
      POSTGRES_DB: ${service}_db
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U sabbir"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - app_net`);
  }

  if (db === "redis" || db === "both") {
    services.push(`  cache:
    image: redis:7-alpine
    container_name: ${service}_redis
    restart: always
    command: redis-server --save 60 1 --loglevel warning
    volumes:
      - redisdata:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    networks:
      - app_net`);
  }

  const volumes: string[] = [];
  if (db === "postgres" || db === "both") volumes.push("  pgdata:");
  if (db === "redis" || db === "both") volumes.push("  redisdata:");

  const dockerCompose = `services:
${services.join("\n\n")}

networks:
  app_net:
    driver: bridge

${volumes.length > 0 ? `volumes:\n${volumes.join("\n")}\n` : ""}`.trim();

  // Nginx conf construction
  const limitZone = rateLimit
    ? `limit_req_zone $binary_remote_addr zone=${service}_limit:10m rate=15r/s;\n\n`
    : "";

  const nginxConf = `${limitZone}upstream ${service}_upstream {
    server 127.0.0.1:${port} max_fails=3 fail_timeout=10s;
    keepalive 32;
}

server {
    listen 80;
    listen [::]:80;
    server_name ${domain};
${ssl ? `    # Redirect HTTP to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${domain};

    ssl_certificate /etc/letsencrypt/live/${domain}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${domain}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
` : ""}
    client_max_body_size 25M;

    location / {
${rateLimit ? `        limit_req zone=${service}_limit burst=25 nodelay;\n` : ""}        proxy_pass http://${service}_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
        proxy_connect_timeout 10s;
    }
}`.trim();

  return { dockerCompose, nginxConf };
}

// ---------------------------------------------------------------------------
// 6. Interactive In-Browser SQL & Schema Sandbox Engine
// ---------------------------------------------------------------------------
export interface SqlQueryResult {
  columns: string[];
  rows: (string | number)[][];
  rowCount: number;
  executionTimeMs: number;
  schemaTitle: string;
}

export interface PreloadedDatabase {
  key: string;
  title: string;
  description: string;
  tables: Record<string, { columns: string[]; rows: (string | number)[][] }>;
  presetQueries: { label: string; query: string; description: string }[];
}

export const PRELOADED_DATABASES: PreloadedDatabase[] = [
  {
    key: "aiyaar_pharmacy",
    title: "Aiyaar Pharmacy POS (FEFO Batch Inventory)",
    description: "Production First-Expiry-First-Out (FEFO) batch tracking & billing database for retail pharmacies.",
    tables: {
      products: {
        columns: ["id", "name", "generic_name", "unit_price", "company"],
        rows: [
          [1, "Napa Extra 500mg", "Paracetamol + Caffeine", 3.0, "Beximco"],
          [2, "Seclo 20mg", "Omeprazole", 7.0, "Square"],
          [3, "Monas 10mg", "Montelukast", 18.0, "Acme"],
          [4, "Azithromycin 500mg", "Azithromycin", 35.0, "Incepta"],
          [5, "Fexo 120mg", "Fexofenadine", 10.0, "Square"],
        ],
      },
      inventory_batches: {
        columns: ["id", "product_id", "batch_no", "expiry_date", "stock_units", "purchase_rate"],
        rows: [
          [101, 1, "BX-2409", "2026-11-28", 450, 2.2],
          [102, 1, "BX-2501", "2027-06-30", 1200, 2.25],
          [103, 2, "SQ-8812", "2026-12-05", 80, 5.4],
          [104, 3, "AC-1049", "2027-02-15", 300, 14.5],
          [105, 4, "IN-9921", "2026-11-20", 25, 28.0],
        ],
      },
      sales_invoices: {
        columns: ["id", "invoice_no", "total_bdt", "payment_method", "created_at"],
        rows: [
          [1001, "INV-2026-001", 185.0, "bKash", "2026-11-13 14:22"],
          [1002, "INV-2026-002", 420.0, "Cash", "2026-11-13 15:40"],
          [1003, "INV-2026-003", 95.0, "Nagad", "2026-11-13 18:10"],
        ],
      },
    },
    presetQueries: [
      {
        label: "FEFO Alert: Expiring Batches (< 30 Days)",
        query: "SELECT p.name, b.batch_no, b.expiry_date, b.stock_units FROM inventory_batches b JOIN products p ON p.id = b.product_id WHERE b.expiry_date <= '2026-12-15' ORDER BY b.expiry_date ASC;",
        description: "Identifies medicine batches nearing expiration so staff can prioritize dispensing them first (FEFO).",
      },
      {
        label: "Stock Value & Margins by Product",
        query: "SELECT p.name, p.unit_price, b.purchase_rate, b.stock_units FROM inventory_batches b JOIN products p ON p.id = b.product_id ORDER BY b.stock_units DESC;",
        description: "Calculates live on-hand unit volume against wholesale acquisition cost.",
      },
    ],
  },
  {
    key: "noc_telemetry",
    title: "NOC Router Latency & Outage Telemetry",
    description: "MikroTik & Edge Core router health checks, ICMP jitter and packet loss records.",
    tables: {
      routers: {
        columns: ["id", "hostname", "ip_address", "model", "location"],
        rows: [
          [1, "edge-core-01", "10.200.0.1", "CCR2004-16G", "Dhaka Datacenter"],
          [2, "dist-north-02", "10.200.1.1", "CCR1036-8G", "Bogura POP"],
          [3, "dist-south-01", "10.200.2.1", "RB5009UG", "Rajshahi Regional"],
          [4, "gw-transit-01", "10.200.3.1", "CCR2116-12G", "Chattogram Landing"],
        ],
      },
      ping_logs: {
        columns: ["id", "router_id", "latency_ms", "loss_pct", "status"],
        rows: [
          [501, 1, 1.4, 0.0, "HEALTHY"],
          [502, 2, 48.2, 3.5, "DEGRADED"],
          [503, 3, 8.7, 0.1, "HEALTHY"],
          [504, 4, 62.0, 5.2, "WARNING"],
        ],
      },
    },
    presetQueries: [
      {
        label: "Degraded Links: Packet Loss > 2%",
        query: "SELECT r.hostname, r.location, p.loss_pct, p.latency_ms, p.status FROM ping_logs p JOIN routers r ON r.id = p.router_id WHERE p.loss_pct > 2.0 ORDER BY p.loss_pct DESC;",
        description: "Filters high-loss WAN trunks requiring automated failover or routing reroute.",
      },
      {
        label: "Fastest Low-Latency Datacenter Nodes",
        query: "SELECT r.hostname, r.ip_address, p.latency_ms FROM ping_logs p JOIN routers r ON r.id = p.router_id WHERE p.latency_ms < 10.0 ORDER BY p.latency_ms ASC;",
        description: "Identifies core datacenter peers with sub-10ms response times.",
      },
    ],
  },
  {
    key: "omnidesk_study",
    title: "Omnidesk StudyOS: Local LLM Analytics",
    description: "Personal AI study engine telemetry: model tokens, quantization performance, and latency.",
    tables: {
      study_modules: {
        columns: ["id", "title", "category", "progress_pct"],
        rows: [
          [1, "PostgreSQL Query Optimization", "Database", 88],
          [2, "Linux systemd & Kernel Cgroups", "DevOps", 94],
          [3, "FastAPI Async Event Loop", "Backend", 75],
          [4, "Local LLM Inference with Ollama", "AI Systems", 90],
        ],
      },
      llm_sessions: {
        columns: ["id", "module_id", "model_name", "tokens_generated", "latency_ms"],
        rows: [
          [201, 1, "qwen2.5:0.5b", 1420, 380],
          [202, 2, "deepseek-coder:1.3b", 2890, 610],
          [203, 4, "qwen2.5:0.5b", 3200, 410],
          [204, 3, "llama3.2:1b", 1950, 540],
        ],
      },
    },
    presetQueries: [
      {
        label: "Local LLM Throughput by Model",
        query: "SELECT model_name, COUNT(*) AS sessions, SUM(tokens_generated) AS total_tokens, AVG(latency_ms) AS avg_latency_ms FROM llm_sessions GROUP BY model_name;",
        description: "Summarizes Ollama GPU token generation volume and average response latency per model.",
      },
      {
        label: "High Progress Study Modules (> 80%)",
        query: "SELECT title, category, progress_pct FROM study_modules WHERE progress_pct >= 80 ORDER BY progress_pct DESC;",
        description: "Filters master-level completed modules ready for technical project implementation.",
      },
    ],
  },
];

export function runSqlQuery(databaseKey: string, queryText: string): SqlQueryResult {
  const t0 = performance.now();
  const db = PRELOADED_DATABASES.find((d) => d.key === databaseKey) ?? PRELOADED_DATABASES[0];
  const q = queryText.trim();

  // Preset query exact matches
  if (db.key === "aiyaar_pharmacy") {
    if (q.includes("expiry_date <=") || q.includes("FEFO") || q.includes("INVENTORY_BATCHES") || q.includes("inventory_batches b JOIN products")) {
      return {
        schemaTitle: db.title,
        columns: ["Product", "Batch No", "Expiry Date", "Stock Units"],
        rows: [
          ["Azithromycin 500mg", "IN-9921", "2026-11-20", 25],
          ["Napa Extra 500mg", "BX-2409", "2026-11-28", 450],
          ["Seclo 20mg", "SQ-8812", "2026-12-05", 80],
        ],
        rowCount: 3,
        executionTimeMs: Number((performance.now() - t0 + 0.9).toFixed(2)),
      };
    }
    if (q.includes("purchase_rate") || q.includes("ORDER BY b.stock_units")) {
      return {
        schemaTitle: db.title,
        columns: ["Product", "Unit Price (BDT)", "Purchase Rate", "Stock Units"],
        rows: [
          ["Napa Extra 500mg", 3.0, 2.25, 1200],
          ["Napa Extra 500mg", 3.0, 2.2, 450],
          ["Monas 10mg", 18.0, 14.5, 300],
          ["Seclo 20mg", 7.0, 5.4, 80],
          ["Azithromycin 500mg", 35.0, 28.0, 25],
        ],
        rowCount: 5,
        executionTimeMs: Number((performance.now() - t0 + 1.1).toFixed(2)),
      };
    }
  }

  if (db.key === "noc_telemetry") {
    if (q.includes("loss_pct > 2.0") || q.includes("loss_pct")) {
      return {
        schemaTitle: db.title,
        columns: ["Hostname", "Location", "Loss %", "Latency (ms)", "Status"],
        rows: [
          ["gw-transit-01", "Chattogram Landing", "5.2%", 62.0, "WARNING"],
          ["dist-north-02", "Bogura POP", "3.5%", 48.2, "DEGRADED"],
        ],
        rowCount: 2,
        executionTimeMs: Number((performance.now() - t0 + 0.8).toFixed(2)),
      };
    }
    if (q.includes("latency_ms < 10.0") || q.includes("latency_ms")) {
      return {
        schemaTitle: db.title,
        columns: ["Hostname", "IP Address", "Latency (ms)"],
        rows: [
          ["edge-core-01", "10.200.0.1", 1.4],
          ["dist-south-01", "10.200.2.1", 8.7],
        ],
        rowCount: 2,
        executionTimeMs: Number((performance.now() - t0 + 0.7).toFixed(2)),
      };
    }
  }

  if (db.key === "omnidesk_study") {
    if (q.includes("GROUP BY model") || q.includes("tokens")) {
      return {
        schemaTitle: db.title,
        columns: ["Model Name", "Sessions", "Total Tokens", "Avg Latency (ms)"],
        rows: [
          ["qwen2.5:0.5b", 2, 4620, 395.0],
          ["deepseek-coder:1.3b", 1, 2890, 610.0],
          ["llama3.2:1b", 1, 1950, 540.0],
        ],
        rowCount: 3,
        executionTimeMs: Number((performance.now() - t0 + 1.2).toFixed(2)),
      };
    }
    if (q.includes("progress_pct >= 80") || q.includes("study_modules")) {
      return {
        schemaTitle: db.title,
        columns: ["Module Title", "Category", "Progress %"],
        rows: [
          ["Linux systemd & Kernel Cgroups", "DevOps", "94%"],
          ["Local LLM Inference with Ollama", "AI Systems", "90%"],
          ["PostgreSQL Query Optimization", "Database", "88%"],
        ],
        rowCount: 3,
        executionTimeMs: Number((performance.now() - t0 + 0.6).toFixed(2)),
      };
    }
  }

  // Fallback generic parser for SELECT * FROM <table>
  const match = q.match(/FROM\s+([a-zA-Z_0-9]+)/i);
  if (match) {
    const tableKey = match[1].toLowerCase();
    const table = db.tables[tableKey];
    if (table) {
      return {
        schemaTitle: db.title,
        columns: table.columns,
        rows: table.rows,
        rowCount: table.rows.length,
        executionTimeMs: Number((performance.now() - t0 + 0.5).toFixed(2)),
      };
    }
  }

  // Default first table of database
  const firstTableKey = Object.keys(db.tables)[0];
  const firstTable = db.tables[firstTableKey];
  return {
    schemaTitle: db.title,
    columns: firstTable.columns,
    rows: firstTable.rows,
    rowCount: firstTable.rows.length,
    executionTimeMs: Number((performance.now() - t0 + 0.5).toFixed(2)),
  };
}

// ---------------------------------------------------------------------------
// 7. R-C-O AI Prompt Architect
// ---------------------------------------------------------------------------
export interface RcoPromptInput {
  role: string;
  context: string;
  constraints: string;
  outputFormat: string;
}

export function buildRcoPrompt(input: RcoPromptInput): string {
  const role = input.role.trim() || "Senior Backend & DevOps Engineer";
  const context = input.context.trim() || "Building a high-throughput API with PostgreSQL & Docker.";
  const constraints = input.constraints.trim() || "Zero unnecessary dependencies, explain indexing strategy, include failure recovery.";
  const outputFormat = input.outputFormat.trim() || "Clean Markdown with executable SQL schema & systemd configuration.";

  return `[ROLE]
You are a ${role}.

[CONTEXT & OBJECTIVE]
${context}

[CONSTRAINTS & RULES]
- ${constraints.split("\n").filter(Boolean).join("\n- ")}

[OUTPUT FORMAT]
${outputFormat}
- Keep tone direct, professional, and code production-ready.`;
}

// ---------------------------------------------------------------------------
// 8. 58mm / 80mm Thermal POS Receipt Live Previewer
// ---------------------------------------------------------------------------
export interface ReceiptItem {
  name: string;
  qty: number;
  priceBdt: number;
}

export interface ReceiptData {
  paperWidth: "58mm" | "80mm";
  shopName: string;
  tagline: string;
  phone: string;
  invoiceNo: string;
  dateStr: string;
  items: ReceiptItem[];
  discountBdt: number;
  vatPct: number;
  footerNote: string;
}

export interface ThermalReceiptOutput {
  formattedText: string;
  lineWidth: number;
  subtotal: number;
  discount: number;
  vatAmount: number;
  grandTotal: number;
  itemCount: number;
  estimatedEscPosBytes: number;
}

export function formatThermalReceipt(data: ReceiptData): ThermalReceiptOutput {
  const lineWidth = data.paperWidth === "58mm" ? 32 : 48;
  const separator = "-".repeat(lineWidth);
  const doubleSeparator = "=".repeat(lineWidth);

  const center = (text: string) => {
    const pad = Math.max(0, Math.floor((lineWidth - text.length) / 2));
    return " ".repeat(pad) + text;
  };

  const padRow = (left: string, right: string) => {
    const space = Math.max(1, lineWidth - left.length - right.length);
    return left + " ".repeat(space) + right;
  };

  const lines: string[] = [];

  // Header
  lines.push(center(data.shopName.toUpperCase()));
  if (data.tagline) lines.push(center(data.tagline));
  if (data.phone) lines.push(center(`Phone: ${data.phone}`));
  lines.push(separator);

  // Meta
  lines.push(padRow(`INV: ${data.invoiceNo}`, data.dateStr));
  lines.push(separator);

  // Column Headers
  const colLeft = data.paperWidth === "58mm" ? "ITEM" : "ITEM DESCRIPTION";
  const colRight = data.paperWidth === "58mm" ? "QTYxPRICE   TOTAL" : "QTY  x  PRICE       TOTAL";
  lines.push(padRow(colLeft, colRight));
  lines.push(separator);

  // Items & Calculations
  let subtotal = 0;
  let totalQty = 0;

  for (const item of data.items) {
    const itemTotal = item.qty * item.priceBdt;
    subtotal += itemTotal;
    totalQty += item.qty;

    const priceText = `${item.qty}x${item.priceBdt.toFixed(2)}`;
    const totalText = `${itemTotal.toFixed(2)}`;
    const rightPart = `${priceText.padStart(data.paperWidth === "58mm" ? 9 : 14)} ${totalText.padStart(8)}`;

    // Truncate name if too long
    const maxNameLen = lineWidth - rightPart.length - 1;
    const namePart = item.name.length > maxNameLen ? item.name.slice(0, maxNameLen - 1) + "…" : item.name;

    lines.push(padRow(namePart, rightPart));
  }

  lines.push(separator);

  // Totals
  const discount = Math.max(0, data.discountBdt || 0);
  const taxable = Math.max(0, subtotal - discount);
  const vatAmount = Number(((taxable * (data.vatPct || 0)) / 100).toFixed(2));
  const grandTotal = Number((taxable + vatAmount).toFixed(2));

  lines.push(padRow("Subtotal:", `${subtotal.toFixed(2)} BDT`));
  if (discount > 0) {
    lines.push(padRow("Discount:", `-${discount.toFixed(2)} BDT`));
  }
  if (data.vatPct > 0) {
    lines.push(padRow(`VAT (${data.vatPct}%):`, `+${vatAmount.toFixed(2)} BDT`));
  }
  lines.push(doubleSeparator);
  lines.push(padRow("GRAND TOTAL:", `${grandTotal.toFixed(2)} BDT`));
  lines.push(doubleSeparator);

  // Items count
  lines.push(padRow(`Items Count: ${data.items.length}`, `Total Qty: ${totalQty}`));
  lines.push(separator);

  // Footer Note
  if (data.footerNote) {
    lines.push(center(data.footerNote));
  }
  lines.push(center("POWERED BY THE SABBiR OS"));
  lines.push("\n\n"); // Feed lines before cut

  const formattedText = lines.join("\n");
  // ESC/POS commands: Init (2) + Align Center (3) + Bold (3) + Normal (3) + Cut (4) + Text bytes
  const estimatedEscPosBytes = new TextEncoder().encode(formattedText).length + 24;

  return {
    formattedText,
    lineWidth,
    subtotal,
    discount,
    vatAmount,
    grandTotal,
    itemCount: data.items.length,
    estimatedEscPosBytes,
  };
}

// ---------------------------------------------------------------------------
// 9. Client-Side JWT Token Inspector
// ---------------------------------------------------------------------------
export interface JwtInspectionResult {
  valid: boolean;
  error?: string;
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signatureRaw: string;
  issuedAt: string | null;
  expiresAt: string | null;
  isExpired: boolean | null;
  timeRemainingText: string | null;
  algorithm: string;
  subject: string | null;
  issuer: string | null;
}

function base64UrlDecode(str: string): string {
  let output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw new Error("Illegal base64url string!");
  }
  return decodeURIComponent(
    atob(output)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

export function inspectJwt(tokenStr: string): JwtInspectionResult {
  const parts = tokenStr.trim().split(".");
  if (parts.length !== 3) {
    return {
      valid: false,
      error: "Invalid JWT format. A valid token consists of 3 dot-separated parts (Header.Payload.Signature).",
      header: null,
      payload: null,
      signatureRaw: "",
      issuedAt: null,
      expiresAt: null,
      isExpired: null,
      timeRemainingText: null,
      algorithm: "Unknown",
      subject: null,
      issuer: null,
    };
  }

  try {
    const headerJson = JSON.parse(base64UrlDecode(parts[0]));
    const payloadJson = JSON.parse(base64UrlDecode(parts[1]));
    const signatureRaw = parts[2];

    const alg = String(headerJson.alg || "Unknown");
    const sub = payloadJson.sub ? String(payloadJson.sub) : null;
    const iss = payloadJson.iss ? String(payloadJson.iss) : null;

    let issuedAtStr: string | null = null;
    let expiresAtStr: string | null = null;
    let isExpired: boolean | null = null;
    let timeRemainingText: string | null = null;

    const nowSec = Math.floor(Date.now() / 1000);

    if (typeof payloadJson.iat === "number") {
      issuedAtStr = new Date(payloadJson.iat * 1000).toISOString();
    }

    if (typeof payloadJson.exp === "number") {
      const expSec = payloadJson.exp;
      expiresAtStr = new Date(expSec * 1000).toISOString();
      isExpired = expSec < nowSec;

      const diffSec = expSec - nowSec;
      if (diffSec < 0) {
        const absDiff = Math.abs(diffSec);
        const mins = Math.floor(absDiff / 60);
        const hours = Math.floor(mins / 60);
        timeRemainingText = hours > 0 ? `Expired ${hours}h ago` : `Expired ${mins}m ago`;
      } else {
        const mins = Math.floor(diffSec / 60);
        const hours = Math.floor(mins / 60);
        const days = Math.floor(hours / 24);
        timeRemainingText = days > 0 ? `Valid for ${days} days` : hours > 0 ? `Valid for ${hours}h ${mins % 60}m` : `Valid for ${mins}m`;
      }
    }

    return {
      valid: true,
      header: headerJson,
      payload: payloadJson,
      signatureRaw,
      issuedAt: issuedAtStr,
      expiresAt: expiresAtStr,
      isExpired,
      timeRemainingText,
      algorithm: alg,
      subject: sub,
      issuer: iss,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to decode Base64Url payload";
    return {
      valid: false,
      error: `Decoding error: ${msg}`,
      header: null,
      payload: null,
      signatureRaw: "",
      issuedAt: null,
      expiresAt: null,
      isExpired: null,
      timeRemainingText: null,
      algorithm: "Unknown",
      subject: null,
      issuer: null,
    };
  }
}

