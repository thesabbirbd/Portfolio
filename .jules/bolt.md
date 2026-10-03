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
