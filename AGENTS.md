# DevRoast - Global Patterns

## Project Overview
Next.js app for code roasting and ranking, built with Tailwind CSS 4.0 and Biome.

## Core Mandates
1. **Design System**: Use Tailwind variables from `@theme` in `globals.css` (e.g., `bg-accent-green`).
2. **Typography**: `JetBrains Mono` for code/UI, system fonts for prose.
3. **Components**:
   - Atomic components in `src/components/ui`.
   - Use `tailwind-variants` (TV) for logic.
   - Always wrap class merging in `cn()` (twMerge + clsx).
   - Standardize on `rounded-none` and strict grid gaps.
4. **Code Quality**: Strict Biome linting/formatting. Server Components by default.
5. **Exports**: Named exports only. No `export default` for components.
