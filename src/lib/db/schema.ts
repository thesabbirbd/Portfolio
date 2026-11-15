import { pgTable, serial, varchar, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

/**
 * 1. Content & Tool Telemetry
 * Real database-backed counters for views, prompt copies, tool runs and upvotes.
 */
export const contentMetrics = pgTable("content_metrics", {
  slug: varchar("slug", { length: 120 }).primaryKey(),
  category: varchar("category", { length: 40 }).notNull(),
  viewsCount: integer("views_count").notNull().default(0),
  copiesCount: integer("copies_count").notNull().default(0),
  runsCount: integer("runs_count").notNull().default(0),
  helpfulCount: integer("helpful_count").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * 2. Contact & Hiring Leads
 * Direct lead capture solving the mailto-only limitation for mobile & web visitors.
 */
export const contactLeads = pgTable("contact_leads", {
  id: serial("id").primaryKey(),
  intent: varchar("intent", { length: 50 }).notNull(),
  senderName: varchar("sender_name", { length: 120 }).notNull(),
  senderEmail: varchar("sender_email", { length: 160 }).notNull(),
  senderPhoneOrTg: varchar("sender_phone_or_tg", { length: 80 }),
  message: text("message").notNull(),
  sourcePage: varchar("source_page", { length: 100 }).default("/contact"),
  telegramNotified: boolean("telegram_notified").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * 3. Interactive Prompt & Snippet Vault
 */
export const promptVault = pgTable("prompt_vault", {
  id: varchar("id", { length: 80 }).primaryKey(),
  title: varchar("title", { length: 160 }).notNull(),
  episodeSlug: varchar("episode_slug", { length: 100 }),
  promptTemplate: text("prompt_template").notNull(),
  copyCount: integer("copy_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * 4. Automated GitHub Repositories Cache
 */
export const githubReposCache = pgTable("github_repos_cache", {
  repoName: varchar("repo_name", { length: 100 }).primaryKey(),
  starsCount: integer("stars_count").notNull().default(0),
  forksCount: integer("forks_count").notNull().default(0),
  openIssues: integer("open_issues").notNull().default(0),
  latestCommitSha: varchar("latest_commit_sha", { length: 40 }),
  latestCommitDate: timestamp("latest_commit_date", { withTimezone: true }),
  primaryLanguage: varchar("primary_language", { length: 50 }),
  syncedAt: timestamp("synced_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * 5. THE SABBiR OS Arcade Game Scores & Leaderboards
 */
export const gameScores = pgTable("game_scores", {
  id: serial("id").primaryKey(),
  gameId: varchar("game_id", { length: 50 }).notNull(),
  playerHandle: varchar("player_handle", { length: 60 }).notNull(),
  score: integer("score").notNull(),
  rankTier: varchar("rank_tier", { length: 50 }).notNull().default("Novice Scout"),
  accuracyPct: integer("accuracy_pct").notNull().default(100),
  survivalSeconds: integer("survival_seconds").notNull().default(0),
  xpEarned: integer("xp_earned").notNull().default(0),
  challengeHash: varchar("challenge_hash", { length: 64 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * 6. Autonomous Pulse Articles & Viral Tech Drops
 */
export const pulseArticles = pgTable("pulse_articles", {
  id: varchar("id", { length: 120 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  source: varchar("source", { length: 100 }).notNull(),
  sourceUrl: text("source_url").notNull(),
  category: varchar("category", { length: 60 }).notNull(),
  summary: text("summary").notNull(),
  engineeringTakeaway: text("engineering_takeaway").notNull(),
  seoKeywords: text("seo_keywords").notNull(),
  hashtags: text("hashtags").notNull(),
  points: integer("points").notNull().default(0),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * 7. Open-Source Tools Directory Registry
 */
export const opensourceDirectory = pgTable("opensource_directory", {
  id: varchar("id", { length: 80 }).primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  tier: varchar("tier", { length: 30 }).notNull(),
  category: varchar("category", { length: 60 }).notNull(),
  description: text("description").notNull(),
  installCommand: text("install_command").notNull(),
  githubUrl: text("github_url").notNull(),
  tutorialUrl: text("tutorial_url"),
  copyCount: integer("copy_count").notNull().default(0),
  starsCount: integer("stars_count").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/* =========================================================================
 * 8. SAAS WORKPLACE SUITE TABLES (v5.2.11)
 * ========================================================================= */

/**
 * Workspace Users & Guests
 * Roles: 'guest' | 'member' | 'pro' | 'superadmin'
 */
export const workspaceUsers = pgTable("workspace_users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  handle: varchar("handle", { length: 60 }).notNull().unique(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 160 }),
  passHash: varchar("pass_hash", { length: 128 }),
  role: varchar("role", { length: 30 }).notNull().default("guest"),
  totalXp: integer("total_xp").notNull().default(0),
  exportsCount: integer("exports_count").notNull().default(0),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Gamified XP Ledger
 * Audit trail of XP awarded for exports, game wins, and activities.
 */
export const xpLedger = pgTable("xp_ledger", {
  id: serial("id").primaryKey(),
  userHandle: varchar("user_handle", { length: 60 }).notNull(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  actionType: varchar("action_type", { length: 50 }).notNull(),
  targetSlug: varchar("target_slug", { length: 80 }).notNull(),
  xpDelta: integer("xp_delta").notNull().default(25),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * 24-Hour Ephemeral Shares
 * Auto-purging links for outputs from any of the 35 tools.
 */
export const ephemeralShares = pgTable("ephemeral_shares", {
  token: varchar("token", { length: 32 }).primaryKey(),
  creatorName: varchar("creator_name", { length: 100 }).notNull(),
  toolSlug: varchar("tool_slug", { length: 80 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  contentType: varchar("content_type", { length: 50 }).notNull().default("application/json"),
  payloadJson: text("payload_json").notNull(),
  previewDataUrl: text("preview_data_url"),
  pinCode: varchar("pin_code", { length: 64 }),
  viewsCount: integer("views_count").notNull().default(0),
  maxViews: integer("max_views"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Tool Permissions Matrix
 * Configurable access modes: 'open' | 'gated' | 'members_only' | 'maintenance'
 */
export const toolPermissions = pgTable("tool_permissions", {
  toolSlug: varchar("tool_slug", { length: 80 }).primaryKey(),
  accessMode: varchar("access_mode", { length: 30 }).notNull().default("gated"),
  dailyLimit: integer("daily_limit").notNull().default(100),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Security Audit Logs
 * Captures blocked SQLi, XSS, and DDoS rate limit violations.
 */
export const securityAuditLogs = pgTable("security_audit_logs", {
  id: serial("id").primaryKey(),
  ipHash: varchar("ip_hash", { length: 64 }).notNull(),
  route: varchar("route", { length: 120 }).notNull(),
  threatType: varchar("threat_type", { length: 40 }).notNull(),
  payloadSnippet: text("payload_snippet").notNull(),
  blocked: boolean("blocked").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
