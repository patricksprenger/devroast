import { diffLines } from "diff";
import { eq } from "drizzle-orm";
import { Share2 } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { db } from "@/db";
import { roasts } from "@/db/schema";

interface RoastPageProps {
	params: Promise<{
		id: string;
	}>;
}

export async function generateMetadata({
	params,
}: RoastPageProps): Promise<Metadata> {
	const { id } = await params;

	const roast = await db.query.roasts.findFirst({
		where: eq(roasts.id, id),
	});

	if (!roast) return {};

	const lineCount = roast.code.split("\n").length;
	const ogUrl = new URL("/api/og/roast", "https://devroast.com");
	ogUrl.searchParams.set("score", roast.score);
	ogUrl.searchParams.set("verdict", roast.verdict);
	ogUrl.searchParams.set("quote", roast.roastQuote);
	ogUrl.searchParams.set("lang", roast.language);
	ogUrl.searchParams.set("lines", lineCount.toString());

	return {
		title: `Roast #${id} - devroast`,
		description: roast.roastQuote,
		openGraph: {
			title: `Code Roast Score: ${roast.score}/10`,
			description: roast.roastQuote,
			images: [
				{
					url: ogUrl.toString(),
					width: 1200,
					height: 630,
					alt: `Roast score ${roast.score}/10 for ${roast.language} code`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `Code Roast Score: ${roast.score}/10`,
			description: roast.roastQuote,
			images: [ogUrl.toString()],
		},
	};
}

export default async function RoastResultPage({ params }: RoastPageProps) {
	"use cache";
	cacheLife("days");
	const { id } = await params;

	const roast = await db.query.roasts.findFirst({
		where: eq(roasts.id, id),
		with: {
			analysisItems: true,
		},
	});

	if (!roast) {
		notFound();
	}

	const diffs = diffLines(roast.code, roast.improvedCode ?? "");
	const processedDiffs = diffs.flatMap((part) => {
		const lines = part.value.split("\n");
		if (lines[lines.length - 1] === "") lines.pop();
		return lines.map((line) => ({
			type: (part.added ? "added" : part.removed ? "removed" : "context") as
				| "added"
				| "removed"
				| "context",
			code: line,
		}));
	});

	const lineCount = roast.code.split("\n").length;

	return (
		<div className="flex flex-col min-h-screen bg-bg-page">
			<main className="flex flex-col gap-10 px-20 py-10 max-w-[1440px] mx-auto w-full">
				{/* Score Hero Section */}
				<section className="flex items-center gap-12 w-full">
					<ScoreRing score={Number(roast.score)} />

					<div className="flex flex-col gap-4 flex-1">
						<Badge variant={Number(roast.score) < 3 ? "critical" : "warning"}>
							verdict: {roast.verdict}
						</Badge>

						<h1 className="text-text-primary font-mono text-2xl leading-relaxed max-w-2xl">
							"{roast.roastQuote}"
						</h1>

						<div className="flex items-center gap-4 text-text-tertiary font-mono text-[13px]">
							<span>lang: {roast.language}</span>
							<span>·</span>
							<span>{lineCount} lines</span>
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
						code={roast.code}
						lang={roast.language}
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
						{roast.analysisItems.map((issue) => (
							<Card
								key={issue.id}
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
								your_code.{roast.language} → improved_code.{roast.language}
							</span>
						</div>
						<div className="py-1">
							{processedDiffs.map((line, index) => (
								<DiffLine
									// biome-ignore lint/suspicious/noArrayIndexKey: lines can be identical
									key={index}
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
