/**
 * Configuration for THE SABBiR OS Autonomous Daily Pulse Harvester
 */
export const PULSE_CONFIG = {
  sources: {
    hackerNews: {
      enabled: true,
      topStoriesUrl: "https://hacker-news.firebaseio.com/v0/topstories.json",
      itemUrl: (id) => `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
      maxItems: 30,
      keywords: ["ai", "postgres", "sql", "linux", "docker", "python", "fastapi", "open-source", "rust", "sqlite", "kernel"],
    },
    githubTrending: {
      enabled: true,
      apiUrl: "https://api.github.com/search/repositories?q=stars:>50+pushed:>2026-11-01&sort=stars&order=desc",
      maxItems: 10,
    },
  },
  outputFilePath: "src/data/auto-pulse.json",
  minViralityScore: 200,
};
