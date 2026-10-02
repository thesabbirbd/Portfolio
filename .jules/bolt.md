## Performance Issue: Redundant Markdown parsing
*   **What was slow:** Repeated I/O of reading and parsing Markdown files using `gray-matter` whenever functions like `getAllContent` were called (especially problematic when looping or assembling data like in `ConnectedKnowledge.tsx`).
*   **How it was fixed:** Introduced an in-memory `Map` inside `src/lib/content.ts` that caches the parsed output of `getAllContent`. To preserve developer experience (HMR, drafts editing), the cache bypasses entirely when `NODE_ENV === 'development'`.
*   **Benchmark:** Reduced execution time of fetching all categories from ~70ms to ~13ms, and `ConnectedKnowledge` component time from ~82ms to ~33ms.
