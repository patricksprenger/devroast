# tRPC Backend Patterns

## Core Principles
1. **Zod Validation**: All procedures that accept input MUST use Zod for validation.
2. **Context**: Use the `createTRPCContext` to access the database (`db`) and headers.
3. **Routers**: 
   - Keep the `root.ts` clean by delegating to sub-routers as the project grows.
   - Use named exports for all routers.
4. **Procedures**:
   - Use `publicProcedure` for non-authenticated actions.
   - Implement custom middlewares for authentication/authorization when needed.
5. **Drizzle Integration**:
   - Perform database logic directly inside procedures or delegated service functions.
   - Prefer `sql` tagged templates for complex aggregations.
6. **Performance**:
   - Use `Promise.all` to execute multiple independent database queries in parallel within a single procedure.
