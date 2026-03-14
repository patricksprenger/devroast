import { Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";

interface RoastPageProps {
	params: Promise<{
		id: string;
	}>;
}

const STATIC_ROAST = {
	score: 1.8,
	verdict: "needs_serious_help",
	quote:
		"this code looks like it was written during a power outage... in 2005.",
	language: "javascript",
	lines: 7,
	originalCode: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  
  return total;
}`,
	issues: [
		{
			severity: "critical" as const,
			title: "using var instead of const/let",
			description:
				"var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed.",
		},
		{
			severity: "warning" as const,
			title: "imperative loop pattern",
			description:
				"for loops are verbose and error-prone. use .reduce() or .map() for cleaner, functional transformations.",
		},
		{
			severity: "good" as const,
			title: "clear naming conventions",
			description:
				"calculateTotal and items are descriptive, self-documenting names that communicate intent without comments.",
		},
		{
			severity: "good" as const,
			title: "single responsibility",
			description:
				"the function does one thing well — calculates a total. no side effects, no mixed concerns, no hidden complexity.",
		},
	],
	diff: [
		{ type: "context" as const, code: "function calculateTotal(items) {" },
		{ type: "removed" as const, code: "  var total = 0;" },
		{
			type: "removed" as const,
			code: "  for (var i = 0; i < items.length; i++) {",
		},
		{ type: "removed" as const, code: "    total = total + items[i].price;" },
		{ type: "removed" as const, code: "  }" },
		{ type: "removed" as const, code: "  return total;" },
		{
			type: "added" as const,
			code: "  return items.reduce((sum, item) => sum + item.price, 0);",
		},
		{ type: "context" as const, code: "}" },
	],
};

export default async function RoastResultPage({ params }: RoastPageProps) {
	// biome-ignore lint/correctness/noUnusedVariables: id will be used later
	const { id } = await params;

	return (
		<div className="flex flex-col min-h-screen bg-bg-page">

			<main className="flex flex-col gap-10 px-20 py-10 max-w-[1440px] mx-auto w-full">
				{/* Score Hero Section */}
				<section className="flex items-center gap-12 w-full">
					<ScoreRing score={STATIC_ROAST.score} />

					<div className="flex flex-col gap-4 flex-1">
						<Badge variant={STATIC_ROAST.score < 3 ? "critical" : "warning"}>
							verdict: {STATIC_ROAST.verdict}
						</Badge>

						<h1 className="text-text-primary font-mono text-2xl leading-relaxed max-w-2xl">
							"{STATIC_ROAST.quote}"
						</h1>

						<div className="flex items-center gap-4 text-text-tertiary font-mono text-[13px]">
							<span>lang: {STATIC_ROAST.language}</span>
							<span>·</span>
							<span>{STATIC_ROAST.lines} lines</span>
						</div>

						<div className="pt-2">
							<Button variant="outline" size="sm" className="gap-2">
								<Share2 size={14} />$ share_roast
							</Button>
						</div>
					</div>
				</section>

				<div className="h-px bg-border-primary w-full" />

				{/* Original Submission Section */}
				<section className="flex flex-col gap-4">
					<div className="flex items-center gap-2 font-mono font-bold text-sm">
						<span className="text-accent-green">{"//"}</span>
						<span className="text-text-primary">your_submission</span>
					</div>

					<CodeBlock
						code={STATIC_ROAST.originalCode}
						lang={STATIC_ROAST.language}
						className="border-border-primary"
					/>
				</section>

				<div className="h-px bg-border-primary w-full" />

				{/* Detailed Analysis Section */}
				<section className="flex flex-col gap-6">
					<div className="flex items-center gap-2 font-mono font-bold text-sm">
						<span className="text-accent-green">{"//"}</span>
						<span className="text-text-primary">detailed_analysis</span>
					</div>

					<div className="grid grid-cols-2 gap-5">
						{STATIC_ROAST.issues.map((issue) => (
							<Card
								key={issue.title}
								padding="default"
								gap="default"
								className="bg-bg-input"
							>
								<Badge variant={issue.severity} size="sm">
									{issue.severity.toUpperCase()}
								</Badge>
								<h3 className="text-text-primary font-mono font-bold text-[13px] uppercase tracking-wide">
									{issue.title}
								</h3>
								<p className="text-text-secondary font-mono text-xs leading-relaxed">
									{issue.description}
								</p>
							</Card>
						))}
					</div>
				</section>

				<div className="h-px bg-border-primary w-full" />

				{/* Suggested Fix Section */}
				<section className="flex flex-col gap-6">
					<div className="flex items-center gap-2 font-mono font-bold text-sm">
						<span className="text-accent-green">{"//"}</span>
						<span className="text-text-primary">suggested_fix</span>
					</div>

					<div className="border border-border-primary bg-bg-input overflow-hidden">
						<div className="h-10 border-b border-border-primary bg-bg-surface flex items-center px-4">
							<span className="text-[11px] font-mono text-text-secondary font-medium">
								your_code.ts → improved_code.ts
							</span>
						</div>
						<div className="py-1">
							{STATIC_ROAST.diff.map((line) => (
								<DiffLine
									key={line.code + line.type}
									type={line.type}
									code={line.code}
								/>
							))}
						</div>
					</div>
				</section>

				<div className="h-20" />
			</main>
		</div>
	);
}
