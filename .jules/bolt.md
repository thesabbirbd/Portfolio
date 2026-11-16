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

## API Search Index Caching & Global Cache Fetching
- When caching aggregated data globally in a Next.js API route using a module-level variable, bypass the cache during development (`process.env.NODE_ENV === 'development'`) to ensure content changes reflect instantly without requiring a server restart.
- Caching CPU-intensive operations (like markdown parsing and aggregating multiple directories) in-memory can decrease API response times dramatically (e.g., from ~40-60ms to ~0.1-0.4ms) under load.
- Utilize `getGlobalContent()` when all content paths are needed at once, as it manages an internal `globalContentCache`, reducing initial blocking time from ~38ms to ~11ms.

## Performance Optimization: Caching global content aggregation
- **What**: Introduced `getGlobalContent()` and `slugsCache` in `src/lib/content.ts` to cache the global content array across the 4 content categories in memory. Updated `ConnectedKnowledge` to call `getGlobalContent()` instead of multiple independent array generations.
- **Why**: Avoids redundant `getAllContent` calls computing all categories linearly and separately, repeatedly executing synchronous filesystem reads.

## O(n) rendering filters
- **What**: Replaced implicit `.some()` loop filters array creations with single `for` loops in `src/components/content/ConnectedKnowledge.tsx`, as well as removed `.filter` spread instantiations on backlinks.
- **Why**: Reduced CPU overhead massively for knowledge base components by stopping multiple temporary array `Set`/spread allocations on every global list iteration.

## 2024-05-18 - Optimized Array Inclusion Checks in React Components
**Learning:** Found nested O(N*M) checks (`array.includes()`) iterating over large `globalContent` arrays in `ConnectedKnowledge.tsx` to calculate implicit connections. Moving the source array into a `Set` outside the loop, and then checking `.has()` on that set against the dynamic iteration array, dramatically reduced calculation time by changing complexity from `O(N * (T_m * T_t))` to `O(T_m + N * T_t)`.
**Action:** When performing inclusion checks between arrays inside loops that run frequently or over large datasets (like global content aggregators), extract the static side of the check into a `Set` initialized before the loop to leverage O(1) lookups.
