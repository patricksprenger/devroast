# Design Spec: Leaderboard Integration and Expansion

## 1. Overview
The goal is to implement the full functional leaderboard at `/leaderboard`, replacing the static mock data with real data fetched from the backend via tRPC. The design will follow the "shame leaderboard" style established on the homepage, including collapsible rows and syntax highlighting, while maintaining a detailed hero section with animated metrics.

## 2. Architecture & Data Flow

### 2.1 Backend (tRPC)
We will evolve the existing `getLeaderboard` procedure in `src/server/root.ts`.

- **Input**: `{ limit: z.number().min(1).max(100).default(3) }` (using Zod validation).
- **Output**: 
  - `items`: Array of Roast objects (id, code, language, score, etc.)
  - `totalCount`: Total number of public roasts in the DB.
- **Logic**: Use Drizzle to fetch public roasts, ordered by `score` ascending (lower is worse/more "shameful"), limited by the input parameter.

### 2.2 Frontend (Next.js & tRPC)

#### 2.2.1 Component Organization
To avoid cross-feature pollution and follow project mandates, we will:
- Move/Refactor `LeaderboardHeader`, `LeaderboardRow`, and `LeaderboardSkeleton` from `src/components/home/` to `src/components/leaderboard/`.
- Ensure these components are generic enough for use in both the Homepage and the dedicated Leaderboard page.

#### 2.2.2 Page Strategy (`src/app/leaderboard/page.tsx`)
- **Main Page**: A Server Component that fetches the initial 20 leaderboard entries using `api.getLeaderboard({ limit: 20 })`.
- **Hero Metrics**: A dedicated Client Component (`LeaderboardHeroMetrics`) will be created to follow the **Progressive Loading** mandate. It will use `api.getMetrics.useQuery()` and animate numeric values (submissions count and average score) using `number-flow`.
- **Loading State**: Implement `loading.tsx` for the `/leaderboard` route or use `Suspense` with `LeaderboardSkeleton` to provide a smooth transition.

## 3. UI/UX Details

### 3.1 Hero Section
- Maintain the large "shame_leaderboard" title with the `>` prefix.
- Display animated real-time stats: "X submissions · avg score: Y/10".
- **Typography**: Numeric data and the title must use `JetBrains Mono` as per Mandate 2.

### 3.2 The List
- 20 items per request (no pagination required for now).
- Collapsible rows for code blocks longer than 4 lines (logic handled by `LeaderboardRow`).
- Syntax highlighting via `CodeBlock` (Shiki).
- Layout: Same border-primary container and surface background as the homepage list.

## 4. Error Handling & Loading
- **Server-side**: Next.js will handle initial data fetching. Error boundaries will catch tRPC failures.
- **Progressive Loading**: Metrics will start at 0 and animate to their actual values.
- **Empty State**: Reuse the "// no roasts yet. be the first?" message if `items.length === 0`.

## 5. Success Criteria
- [ ] `/leaderboard` displays 20 real roasts from the DB.
- [ ] Visual style (Header/Rows) is consistent between Home and Leaderboard pages.
- [ ] Hero section metrics animate using `number-flow` (Progressive Loading).
- [ ] Shared components are moved to a common `src/components/leaderboard/` directory.
- [ ] Biome linting/formatting passes.
- [ ] All tRPC procedures use named exports and Zod validation.
