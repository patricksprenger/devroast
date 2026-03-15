import { asc, sql } from "drizzle-orm";
import { cacheLife } from "next/cache";
import { LeaderboardHeroMetrics } from "@/components/leaderboard/hero-metrics";
import { LeaderboardHeader } from "@/components/leaderboard/leaderboard-header";
import { LeaderboardRow } from "@/components/leaderboard/leaderboard-row";
import { CodeBlock } from "@/components/ui/code-block";
import { db } from "@/db";
import { roasts } from "@/db/schema";

export default async function LeaderboardPage() {
	"use cache";
	cacheLife("hours");

	const entries = await db
		.select()
		.from(roasts)
		.where(sql`${roasts.isPrivate} = false`)
		.orderBy(asc(roasts.score))
		.limit(20);

	return (
		<div className="flex flex-col min-h-screen bg-bg-page">
			<div className="flex flex-col gap-10 px-20 py-10 max-w-[1440px] mx-auto w-full">
				{/* Hero Section */}
				<section className="flex flex-col gap-4 w-full">
					<div className="flex items-center gap-3">
						<span className="text-accent-green font-mono font-bold text-[32px]">
							{">"}
						</span>
						<h1 className="text-text-primary font-mono font-bold text-[28px]">
							shame_leaderboard
						</h1>
					</div>
					<p className="text-text-secondary font-mono text-sm">
						{"//"} the most roasted code on the internet
					</p>
					<LeaderboardHeroMetrics />
				</section>

				{/* Leaderboard Entries */}
				<div className="flex flex-col border border-border-primary bg-bg-surface overflow-hidden mt-4">
					<LeaderboardHeader />
					{entries.map((entry, index) => (
						<LeaderboardRow
							key={entry.id}
							rank={`#${index + 1}`}
							score={entry.score.toString()}
							language={entry.language}
							code={entry.code}
						>
							<CodeBlock
								code={entry.code}
								lang={entry.language}
								className="border-none"
								withHeader={false}
							/>
						</LeaderboardRow>
					))}
					{entries.length === 0 && (
						<div className="p-8 text-center text-text-tertiary font-mono text-sm">
							{"//"} no roasts yet. be the first?
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
