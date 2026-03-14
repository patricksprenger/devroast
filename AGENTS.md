# DevRoast - Global Patterns

## Project Overview
Next.js app for code roasting and ranking, built with Tailwind CSS 4.0, Biome, and tRPC.

## Core Mandates
1. **Design System**: Use Tailwind variables from `@theme` in `globals.css` (e.g., `bg-accent-green`).
2. **Typography**: `JetBrains Mono` for code/UI, system fonts for prose.
3. **Components**:
   - Atomic components in `src/components/ui`.
   - Use `tailwind-variants` (TV) for logic.
   - Always wrap class merging in `cn()` (twMerge + clsx).
   - Standardize on `rounded-none` and strict grid gaps.
4. **API & Data**:
   - Use **tRPC** for all internal API communications.
   - Use `zod` for input validation.
   - Server Components by default. Use Client Components only when interactivity or hooks (e.g., tRPC hooks) are required.
5. **Loading States**:
   - For numeric metrics, prefer **Progressive Loading** (start at 0 and animate with `number-flow`) over skeletons to avoid layout shifts and provide a better UX.
6. **Code Quality**: Strict Biome linting/formatting.
7. **Exports**: Named exports only. No `export default` for components.
8. **Specifications**: Always create a spec in `specs/` before implementing new features (follow `specs/AGENTS.md`).
9. **Workflow**: NEVER commit or push changes unless explicitly requested by the user.
