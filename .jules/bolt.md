# Performance Learnings

- When caching aggregated data globally in a Next.js API route using a module-level variable, bypass the cache during development (`process.env.NODE_ENV === 'development'`) to ensure content changes reflect instantly without requiring a server restart.
- Caching CPU-intensive operations (like markdown parsing and aggregating multiple directories) in-memory can decrease API response times dramatically (e.g., from ~40-60ms to ~0.1-0.4ms) under load.
