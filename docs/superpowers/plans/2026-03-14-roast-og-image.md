# Dynamic OpenGraph Images Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a dynamic OpenGraph image generation endpoint using `takumi` to provide visual summaries of roast results.

**Architecture:** A Next.js Route Handler (`/api/og/roast`) that accepts query parameters and returns an image generated via `takumi/ImageResponse`. The roast result page will be updated to point to this endpoint.

**Tech Stack:** Next.js (Route Handlers), Tailwind CSS 4.0, Takumi (`ImageResponse`), Zod, JetBrains Mono font.

---

## Chunk 1: Infrastructure and Font Assets

### Task 1: Verify Dependencies and Prepare Fonts

**Files:**
- Modify: `package.json`
- Create: `public/fonts/JetBrainsMono-Bold.ttf`

- [ ] **Step 1: Check if takumi is installed**

Run: `npm list takumi`
Expected: If not installed, run `npm install takumi`.

- [ ] **Step 2: Ensure font directory exists**

Run: `mkdir -p public/fonts`

- [ ] **Step 3: Download/Copy JetBrains Mono Bold**

Run: `cp /path/to/local/font/JetBrainsMono-Bold.ttf public/fonts/` (or equivalent)
*Note: If font is missing, it must be downloaded or fetched during implementation.*

- [ ] **Step 4: Commit**

```bash
git add package.json
git commit -m "chore: ensure og image dependencies"
```

---

## Chunk 2: API Implementation

### Task 2: Create OG Roast Route Handler

**Files:**
- Create: `src/app/api/og/roast/route.tsx`

- [ ] **Step 1: Define Zod schema and basic Route Handler**

```typescript
import { ImageResponse } from 'takumi';
import { z } from 'zod';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const ogSchema = z.object({
  score: z.string(),
  verdict: z.string(),
  quote: z.string(),
  lang: z.string(),
  lines: z.string().transform(Number),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = ogSchema.safeParse(Object.fromEntries(searchParams.entries()));
  if (!parsed.success) return new Response('Invalid params', { status: 400 });
  
  const fontData = await readFile(join(process.cwd(), 'public/fonts/JetBrainsMono-Bold.ttf'));

  return new ImageResponse(
    <div style={{ fontFamily: 'JetBrainsMono' }}>{parsed.data.score}</div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'JetBrainsMono',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}
```

- [ ] **Step 2: Test basic endpoint**

Run: `curl "http://localhost:3000/api/og/roast?score=3.5&verdict=test&quote=test&lang=ts&lines=10"`
Expected: Success response with image data.

- [ ] **Step 3: Implement full visual design with Tailwind**

Implement the JSX structure following the spec (bg-page #0A0A0A, amber score, etc.).

- [ ] **Step 4: Commit**

```bash
git add src/app/api/og/roast/route.tsx
git commit -m "feat: implement roast og image endpoint"
```

---

## Chunk 3: Integration

### Task 3: Update Roast Page Metadata

**Files:**
- Modify: `src/app/roast/[id]/page.tsx`

- [ ] **Step 1: Add `generateMetadata` function**

```typescript
import type { Metadata } from "next";

export async function generateMetadata({ params }: RoastPageProps): Promise<Metadata> {
  const { id } = await params;
  const roast = await db.query.roasts.findFirst({
    where: eq(roasts.id, id),
  });

  if (!roast) return {};

  const lineCount = roast.code.split("\n").length;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const ogUrl = new URL("/api/og/roast", baseUrl);
  ogUrl.searchParams.set("score", roast.score);
  ogUrl.searchParams.set("verdict", roast.verdict);
  ogUrl.searchParams.set("quote", roast.roastQuote);
  ogUrl.searchParams.set("lang", roast.language);
  ogUrl.searchParams.set("lines", lineCount.toString());

  return {
    title: `Roast Result: ${roast.score}/10`,
    description: roast.roastQuote,
    openGraph: {
      images: [ogUrl.toString()],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogUrl.toString()],
    },
  };
}
```

- [ ] **Step 2: Verify metadata in browser**

Inspect the `<head>` of a roast page to ensure `og:image` is present and correct.

- [ ] **Step 3: Commit**

```bash
git add src/app/roast/[id]/page.tsx
git commit -m "feat: integrate dynamic og image into roast page"
```
