# Design Spec: Dynamic OpenGraph Images for Roast Results

## Context
DevRoast needs dynamic OpenGraph (OG) images for shared roast result links. These images should provide a visual summary of the roast, including the score, verdict, quote, and language information, following the design defined in the Pencil file.

## Goals
- Automatically generate high-quality OG images for roast results.
- Reflect the visual style defined in `devroast.pen` (Frame `4J5QT`).
- Use `takumi` for efficient image generation using Tailwind CSS.
- Minimize latency by passing data via query parameters (Approach A).

## Proposed Solution

### API Endpoint
Create a new Route Handler at `src/app/api/og/roast/route.tsx`.

#### Input Parameters (Query String)
- `score` (string): Numeric score (e.g., "3.5").
- `verdict` (string): The roast verdict (e.g., "needs_serious_help").
- `quote` (string): The roast quote.
- `lang` (string): Programming language name.
- `lines` (number): Number of lines in the original code.

#### Implementation Details
- Use `takumi`'s `ImageResponse` to render JSX into an image.
- Map the input parameters to the visual components.
- Use Tailwind CSS within the JSX to style the elements according to the DevRoast design system.
- Fonts: Use `JetBrains Mono` as per project standards.

### Integration
Update the metadata generation in `src/app/roast/[id]/page.tsx` (or a separate `metadata.ts` if applicable) to include the `openGraph` and `twitter` image tags pointing to the new API endpoint.

Example URL generation:
```
/api/og/roast?score=${roast.score}&verdict=${roast.verdict}&quote=${encodeURIComponent(roast.roastQuote)}&lang=${roast.language}&lines=${lineCount}
```

## Visual Design (Mirroring Frame 4J5QT)
- **Container**: 1200x630px, Background: `#0A0A0A` (bg-page), Border: `1px solid #2A2A2A` (border-primary).
- **Branding**: Top-centered logo with `> devroast`.
- **Score Section**: Large score (e.g., "3.5") in `#F59E0B` (amber-accent) with `/10` in `#4B5563` (text-tertiary).
- **Verdict Section**: Centered badge with a status dot and the verdict text in `#EF4444` (red-accent). Verdict text should remain in `snake_case` to match the project's technical aesthetic.
- **Meta Info**: "lang: [lang] · [lines] lines" in `#6B7280` (text-secondary).
- **Roast Quote**: Italicized, centered quote in `#FAFAFA` (text-primary), max-width ~800px.

## Technical Implementation Notes
- **Fonts**: `JetBrains Mono` will be loaded as an `ArrayBuffer` from a local file (e.g., `public/fonts/JetBrainsMono-Bold.ttf`) to be used in the `ImageResponse` constructor.
- **Takumi**: Use `takumi` to render the JSX with Tailwind CSS support.
- **Validation**: Parameters will be validated using `zod` to ensure type safety and prevent crashes on invalid inputs.

## Success Criteria
- Shared roast links display the correct dynamic image in platforms like Discord, Slack, and Twitter.
- The image visually matches the project's design system.
- Low generation latency.
