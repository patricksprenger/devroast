# Leaderboard Integration and Expansion Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the full functional leaderboard at `/leaderboard` with real-time metrics and tRPC integration.

**Architecture:** Update tRPC query to support dynamic limits, refactor leaderboard UI into a shared feature folder, and implement progressive loading for metrics using `number-flow`.

**Tech Stack:** tRPC, Drizzle ORM, Next.js Server Components, tailwind-variants, `@number-flow/react`.

---

## Chunk 1: Backend & Component Refactor

### Task 1: Update tRPC getLeaderboard Procedure
**Files:**
- Modify: `src/server/root.ts`

- [ ] **Step 1: Update procedure to accept input and use dynamic limit**
Add `import { z } from "zod";` at the top.
Update `getLeaderboard` to use `publicProcedure.input(z.object({ limit: z.number().min(1).max(100).default(3) }))`.
Update the procedure body to use `({ ctx, input })` and pass `input.limit` to the Drizzle `.limit()` call.

```typescript
// Example update
getLeaderboard: publicProcedure
  .input(z.object({ limit: z.number().min(1).max(100).default(3) }))
  .query(async ({ ctx, input }) => {
    const [items, [countResult]] = await Promise.all([
      ctx.db
        .select()
        .from(roasts)
        .where(sql`${roasts.isPrivate} = false`)
        .orderBy(asc(roasts.score))
        .limit(input.limit),
      // ... count logic remains same
    ]);
    return { items, totalCount: countResult?.count ?? 0 };
  }),
```

- [ ] **Step 2: Commit**
```bash
git add src/server/root.ts
git commit -m "feat(trpc): add limit parameter to getLeaderboard"
```

### Task 2: Refactor Components to Shared Folder
**Files:**
- Create: `src/components/leaderboard/`
- Move: `src/components/home/leaderboard-header.tsx` -> `src/components/leaderboard/leaderboard-header.tsx`
- Move: `src/components/home/leaderboard-row.tsx` -> `src/components/leaderboard/leaderboard-row.tsx`
- Move: `src/components/home/leaderboard-skeleton.tsx` -> `src/components/leaderboard/leaderboard-skeleton.tsx`
- Modify: `src/components/home/leaderboard-section.tsx` (Update imports)
- Modify: `src/app/page.tsx` (Update import of `LeaderboardSkeleton`)

- [ ] **Step 1: Create directory and move files**
```bash
mkdir -p src/components/leaderboard
mv src/components/home/leaderboard-header.tsx src/components/leaderboard/
mv src/components/home/leaderboard-row.tsx src/components/leaderboard/
mv src/components/home/leaderboard-skeleton.tsx src/components/leaderboard/
```

- [ ] **Step 2: Update imports in affected files**
Update `src/components/home/leaderboard-section.tsx` to point to `@/components/leaderboard/...`.
Update `src/app/page.tsx` import of `LeaderboardSkeleton`.

- [ ] **Step 3: Verify build**
Run: `npm run lint`

- [ ] **Step 4: Commit**
```bash
git add src/components/leaderboard/ src/components/home/ src/app/page.tsx
git commit -m "refactor: move leaderboard components to shared folder"
```

---

## Chunk 2: Leaderboard Page & Metrics

### Task 3: Implement LeaderboardHeroMetrics (Progressive Loading)
**Files:**
- Create: `src/components/leaderboard/hero-metrics.tsx`

- [ ] **Step 1: Create Client Component with number-flow**
Use the `api` object from `@/trpc/client` (standard project convention).

```tsx
"use client";
import NumberFlow from "@number-flow/react";
import { api } from "@/trpc/client";

export function LeaderboardHeroMetrics() {
  const { data } = api.getMetrics.useQuery();
  const totalRoasts = data?.totalRoasts ?? 0;
  const avgScore = data?.avgScore ?? 0;

  return (
    <div className="flex items-center gap-2 font-mono text-xs text-text-tertiary">
      <div className="flex items-center gap-1">
        <NumberFlow value={totalRoasts} />
        <span>submissions</span>
      </div>
      <span>·</span>
      <div className="flex items-center gap-1">
        <span>avg score:</span>
        <NumberFlow 
          value={avgScore} 
          format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }} 
        />
        <span>/10</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**
```bash
git add src/components/leaderboard/hero-metrics.tsx
git commit -m "feat: add LeaderboardHeroMetrics with progressive loading"
```

### Task 4: Implement Functional Leaderboard Page
**Files:**
- Modify: `src/app/leaderboard/page.tsx`

- [ ] **Step 1: Update imports and page signature**
Import `api` from `@/trpc/server`, `LeaderboardHeader`, `LeaderboardRow`, `LeaderboardHeroMetrics`, and `CodeBlock`.

- [ ] **Step 2: Fetch data and render list**
Call `await api.getLeaderboard({ limit: 20 })`.
Wrap the list in the same border container used in `LeaderboardSection`.
Ensure `LeaderboardRow` children receive a `CodeBlock`.

- [ ] **Step 3: Commit**
```bash
git add src/app/leaderboard/page.tsx
git commit -m "feat: implement real data on leaderboard page"
```

---

## Chunk 3: Final Polishing

### Task 5: Verify Home and Leaderboard pages
- [ ] **Step 1: Run linting and formatting**
Run: `npm run format && npm run lint`

- [ ] **Step 2: Final Verification**
Ensure homepage still works and leaderboard page shows 20 items.

- [ ] **Step 3: Commit**
```bash
git commit -am "chore: final cleanup and formatting"
```
