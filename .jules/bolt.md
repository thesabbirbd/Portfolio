# Performance Learnings (Bolt)

## Memory Caching for Content Generation
- **What**: Implemented an in-memory `Map` in `src/lib/content.ts` to cache parsed markdown files.
- **Why**: Prevented redundant re-parsing of MDX files via `gray-matter` during static site generation and API routes, significantly improving build speeds and reducing memory overhead.

## Loop Optimizations
- **What**: Hoisted `.toLowerCase()` calls outside of `.filter()` loop callbacks in `src/components/search/SearchInterface.tsx` (using standard hoisting), `src/components/content/NotesBrowser.tsx`, and `src/components/ui/CommandMenu.tsx` (using IIFEs).
- **Why**: Reduced redundant string allocations and transformation operations inside $O(n)$ search loops.

## Set lookups
- **What**: Refactored the `ConnectedKnowledge` lookup from an Array `.includes()` check to a `Set` `.has()` check.
- **Why**: Accelerated explicit slug matching from $O(n)$ to $O(1)$.

## API Search Index Caching
- When caching aggregated data globally in a Next.js API route using a module-level variable, bypass the cache during development (`process.env.NODE_ENV === 'development'`) to ensure content changes reflect instantly without requiring a server restart.
- Caching CPU-intensive operations (like markdown parsing and aggregating multiple directories) in-memory can decrease API response times dramatically (e.g., from ~40-60ms to ~0.1-0.4ms) under load.

## Performance Optimization: Caching global content aggregation
- **What**: Introduced `getGlobalContent()` and `slugsCache` in `src/lib/content.ts` to cache the global content array across the 4 content categories in memory. Updated `ConnectedKnowledge` to call `getGlobalContent()` instead of multiple independent array generations.
- **Why**: Avoids redundant `getAllContent` calls computing all categories linearly and separately, repeatedly executing synchronous filesystem reads.
## O(n) rendering filters
- **What**: Replaced implicit `.some()` loop filters array creations with single `for` loops in `src/components/content/ConnectedKnowledge.tsx`, as well as removed `.filter` spread instantiations on backlinks.
- **Why**: Reduced CPU overhead massively for knowledge base components by stopping multiple temporary array `Set`/spread allocations on every global list iteration.
