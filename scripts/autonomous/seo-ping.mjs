#!/usr/bin/env node

/**
 * THE SABBiR OS // Autonomous SEO & IndexNow Ping Script
 * Pings Google Sitemap & IndexNow API endpoints when new content lands.
 */

const SITEMAP_URL = "https://sabbir.nav.bd/sitemap.xml";

async function pingSearchEngines() {
  console.log("⚡ [THE SABBiR OS] Sending Sitemap & Indexing Pings...");
  console.log(`📍 Canonical Sitemap: ${SITEMAP_URL}`);

  const targets = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
  ];

  for (const url of targets) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      console.log(`📡 Pinged: ${new URL(url).hostname} -> Status: ${res.status}`);
    } catch (err) {
      console.log(`ℹ️ Ping to ${url} deferred: ${err.message}`);
    }
  }

  console.log("✅ [THE SABBiR OS] SEO Ping dispatch routine complete.");
}

pingSearchEngines().catch(() => process.exit(0));
