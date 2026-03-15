# Design Spec: Roast Creation and AI Integration

## 1. Overview
Implement the core functionality of DevRoast: allowing users to submit code for AI analysis. The system will support "Roast Mode" for sarcastic reviews, provide structured feedback including improved code suggestions, and store results in the database.

## 2. Architecture & Data Flow

### 2.1 Backend: tRPC & AI SDK
A new tRPC procedure `createRoast` will be added to `src/server/root.ts`.

- **Technologies**: Vercel AI SDK (v6.0+), `@ai-sdk/google` (Gemini).
- **Input**:
  - `code`: string (max 10,000 chars - upgraded from 1,000)
  - `language`: enum (javascript, typescript, python, etc.)
  - `mode`: enum (technical, sarcasm)
- **Logic**:
  1. Initialize Gemini model using `GOOGLE_GENERATIVE_AI_API_KEY`.
  2. Prompt AI using `generateText` with structured `output`.
  3. AI response must include: `score`, `verdict`, `roastQuote`, and an array of `issues`.
  4. Each `issue` includes: `title`, `description`, `severity`, `lineNumber`, and `improvedCode`.
  5. Save data to `roasts` table and bulk insert `analysis_items` within a DB transaction.
  6. Return `roastId`.

### 2.2 Frontend: UI Integration
- **Component**: `src/components/home/home-editor.tsx`
- **Logic**:
  - Update `MAX_CHARACTERS` to 10,000.
  - Map `isRoastMode` (boolean) to tRPC `mode` (`true` -> `sarcasm`, `false` -> `technical`).
  - Detect language using existing `detectLanguage` helper before sending.
- **Hook**: `api.createRoast.useMutation()`
- **Loading State**: The "$ roast_my_code" button will enter a loading state during the API call.
- **Navigation**: Redirect to `/roast/[id]` upon successful creation.

## 3. Detailed AI Strategy

### 3.1 Prompting
- **System Prompt**: 
  - If `mode === 'sarcasm'`: "You are a toxic, extremely sarcastic senior developer. Roast this code brutally. Be funny but technically accurate."
  - If `mode === 'technical'`: "You are a professional software architect. Review this code for best practices, performance, and security."
- **Output Schema (Zod)**:
  ```typescript
  z.object({
    score: z.number().min(0).max(10),
    verdict: z.string().max(100),
    roastQuote: z.string(),
    improvedCode: z.string(), // Global improved version of the entire code
    issues: z.array(z.object({
      title: z.string(),
      description: z.string(),
      severity: z.enum(['critical', 'warning', 'good', 'info']),
      lineNumber: z.number().optional(),
      improvedCode: z.string().optional() // Line-specific improvement
    }))
  })
  ```

## 4. Post-Redirect UX
- **Score Display**: On the `/roast/[id]` page, the numeric score must use **Progressive Loading** (via `number-flow`) to animate from 0 to the final value, following project mandates.

## 5. Dependencies
- `ai` (^4.0.0 or latest)
- `@ai-sdk/google` (latest)
- `zod`

## 6. Success Criteria
- [ ] Users can submit code and receive a redirected roast page.
- [ ] AI correctly identifies the language and provides relevant feedback.
- [ ] Roast Mode (sarcastic) generates noticeably different tone than Technical mode.
- [ ] Improvements (improvedCode) are generated and saved for critical/warning issues.
- [ ] Database contains the persistent roast and all associated analysis items.
- [ ] Error handling for AI failures (e.g., API limits or timeouts).
