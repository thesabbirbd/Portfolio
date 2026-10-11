## Performance Optimizations
- Cached `fs.readdirSync` in `src/lib/content.ts` for directory listing retrieval, improving the execution speed of `getSlugs` from ~550ms for 10000 iterations to ~4ms for the same iterations.
