# Roast Creation and AI Integration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the core roast creation flow using Gemini AI, storing results in the database and displaying them with dynamic scores and diffs.

**Architecture:** tRPC mutation for AI processing and DB storage, direct DB access for cached result pages, and client-side progressive loading for metrics.

**Tech Stack:** tRPC, Vercel AI SDK (v6+), Gemini (`@ai-sdk/google`), Drizzle ORM, `diff` library, `@number-flow/react`.

---

## Chunk 1: Backend & AI Integration

### Task 1: Install Dependencies and Update Schema
**Files:**
- Modify: `package.json`
- Modify: `src/db/schema/index.ts`

- [ ] **Step 1: Install AI and Diff libraries**
Run: `npm install ai @ai-sdk/google diff`
Run: `npm install -D @types/diff`

- [ ] **Step 2: Update Schema with Global Improved Code**
Update `roasts` table in `src/db/schema/index.ts`:
Add `improvedCode: text("improved_code").notNull()`.

- [ ] **Step 3: Push Schema Changes to DB**
Run: `npm run db:push`

- [ ] **Step 4: Commit**
```bash
git add package.json src/db/schema/index.ts
git commit -m "chore: setup ai dependencies and update schema"
```

### Task 2: Implement createRoast tRPC Mutation
**Files:**
- Modify: `src/server/root.ts`

- [ ] **Step 1: Implement Mutation with Schema and Prompts**
Add necessary imports and define the full schema and prompts inside `src/server/root.ts`.

```typescript
import { generateText, Output } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { analysisItems, roasts } from "@/db/schema";

const roastSchema = z.object({
  score: z.number().min(0).max(10),
  verdict: z.string().max(100),
  roastQuote: z.string(),
  improvedCode: z.string(),
  issues: z.array(z.object({
    title: z.string(),
    description: z.string(),
    severity: z.enum(['critical', 'warning', 'good', 'info']),
    lineNumber: z.number().optional(),
    improvedCode: z.string().optional()
  }))
});

const sarcasmPrompt = `You are a toxic, extremely sarcastic senior developer. Roast this code brutally. 
Be funny but technically accurate.
You must provide a global score from 0 to 10 (where 0 is absolute garbage), a short verdict, a roasting quote, 
a full improved version of the code, and a list of specific issues with line numbers and line-specific improvements.`;

const technicalPrompt = `You are a professional software architect. Review this code for best practices, performance, and security.
Provide a global score from 0 to 10, a short professional verdict, a constructive summary quote, 
a full improved version of the code, and a list of specific issues with line numbers and line-specific improvements.`;

// ... Inside appRouter
createRoast: publicProcedure
  .input(z.object({
    code: z.string().max(10000),
    language: z.string(),
    mode: z.enum(['technical', 'sarcasm']),
  }))
  .mutation(async ({ ctx, input }) => {
    const { output } = await generateText({
      model: google('gemini-2.5-flash'),
      system: input.mode === 'sarcasm' ? sarcasmPrompt : technicalPrompt,
      prompt: `Roast this ${input.language} code:\n\n${input.code}`,
      output: Output.object({ schema: roastSchema }),
    });

    return await ctx.db.transaction(async (tx) => {
      const [roast] = await tx.insert(roasts).values({
        code: input.code,
        language: input.language as any,
        mode: input.mode,
        score: output.score.toFixed(1),
        verdict: output.verdict,
        roastQuote: output.roastQuote,
        improvedCode: output.improvedCode,
      }).returning();

      if (output.issues.length > 0) {
        await tx.insert(analysisItems).values(
          output.issues.map(issue => ({
            roastId: roast.id,
            title: issue.title,
            description: issue.description,
            severity: issue.severity,
            lineNumber: issue.lineNumber,
            improvedCode: issue.improvedCode,
          }))
        );
      }
      return roast;
    });
  }),
```

- [ ] **Step 2: Commit**
```bash
git add src/server/root.ts
git commit -m "feat(trpc): implement createRoast mutation with Gemini"
```

---

## Chunk 2: Frontend Integration

### Task 3: Expose Language from CodeEditor
**Files:**
- Modify: `src/components/editor/code-editor.tsx`

- [ ] **Step 1: Add onLanguageChange prop**
Add `onLanguageChange?: (lang: string) => void` to `CodeEditorProps`.
Call it inside `syncLanguage`.

- [ ] **Step 2: Commit**
```bash
git add src/components/editor/code-editor.tsx
git commit -m "refactor: expose language change from CodeEditor"
```

### Task 4: Update HomeEditor with Roast Logic
**Files:**
- Modify: `src/components/home/home-editor.tsx`

- [ ] **Step 1: Implement Mutation Call and Redirection**
Use `api.createRoast.useMutation()`.
Use `useRouter` from `next/navigation`.
Map `isRoastMode` to enum.

```tsx
const { mutate: createRoast, isPending } = api.createRoast.useMutation({
  onSuccess: (data) => {
    router.push(`/roast/${data.id}`);
  },
});
```

- [ ] **Step 2: Update Character Limit**
Change `MAX_CHARACTERS` to 10,000.

- [ ] **Step 3: Commit**
```bash
git add src/components/home/home-editor.tsx
git commit -m "feat: integrate roast creation in HomeEditor"
```

---

## Chunk 3: Dynamic Result Page

### Task 5: Implement Dynamic Data Fetching on Roast Page
**Files:**
- Modify: `src/app/roast/[id]/page.tsx`

- [ ] **Step 1: Fetch Real Data**
Convert to `async` component. Await `params` (Next.js 15).
Use `db` from `@/db` for direct access to avoid tRPC `headers()` issues with `"use cache"`.
Call `notFound()` if roast is missing.
Add `"use cache"` and `cacheLife("days")`.

- [ ] **Step 2: Implement Diff Processing Logic**
Import `{ diffLines } from 'diff'`.
Process the result to split multiline chunks into individual lines for `DiffLine`.

```typescript
const diffs = diffLines(roast.code, roast.improvedCode);
const processedDiffs = diffs.flatMap(part => {
  const lines = part.value.split('\n');
  if (lines[lines.length - 1] === '') lines.pop(); // Remove trailing empty line from split
  return lines.map(line => ({
    type: part.added ? 'added' : part.removed ? 'removed' : 'context',
    code: line
  }));
});
```

- [ ] **Step 3: Update Template with Dynamic Data**
Replace all `STATIC_ROAST` references with fetched `roast` and `analysisItems`.
Ensure score is converted to number: `Number(roast.score)`.

- [ ] **Step 4: Commit**
```bash
git add src/app/roast/[id]/page.tsx
git commit -m "feat: fetch and display real roast data with diffs"
```

### Task 6: Implement Progressive Loading for Score
**Files:**
- Modify: `src/components/ui/score-ring.tsx`

- [ ] **Step 1: Convert to Client Component and use NumberFlow**
Add `"use client"` at the top.
Update the central text to use `NumberFlow` for the score.

- [ ] **Step 2: Commit**
```bash
git add src/components/ui/score-ring.tsx
git commit -m "feat: add progressive loading to ScoreRing"
```

---

## Chunk 4: Final Polish

### Task 7: Verify and Build
- [ ] **Step 1: Run Lint and Build**
Run: `npm run lint && npm run build`

- [ ] **Step 2: Final Commit**
```bash
git commit -am "chore: final cleanup for roast creation feature"
```
