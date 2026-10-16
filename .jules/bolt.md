## Performance Optimizations

### Global Cache Fetching for Local Markdown

- **Issue**: Retrieving all markdown content across categories for operations like a search index required mapping and repeatedly triggering synchronous Node.js I/O inside `getAllContent`.
- **Optimization**: Utilize `getGlobalContent()` when all content paths are needed at once, as it manages an internal `globalContentCache`.
- **Result**: Reduced initial synchronous blocking time from ~38ms to ~11ms, ensuring faster route handling in Next.js.
