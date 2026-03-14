# tRPC Client Patterns (App Router)

## Usage
1. **Server Components (RSC)**:
   - Always import `api` from `@/trpc/server`.
   - Call procedures directly: `await api.myProcedure()`.
2. **Client Components**:
   - Always import `api` from `@/trpc/client`.
   - Use hooks: `api.myProcedure.useQuery()`.
3. **Streaming & Suspense**:
   - When using RSC, prefer fetching data at the component level to enable streaming.
   - Use `Suspense` boundaries to wrap components that fetch data.
4. **Progressive Loading**:
   - If a loading state is undesirable (e.g., for small metrics), use the Client Component hook with a default value of `0` to allow for animated transitions (Progressive Loading).
