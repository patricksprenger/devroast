import { asc, sql } from "drizzle-orm";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { LeaderboardHeader } from "@/components/leaderboard/leaderboard-header";
import { LeaderboardRow } from "@/components/leaderboard/leaderboard-row";
import { CodeBlock } from "@/components/ui/code-block";
import { db } from "@/db";
import { roasts } from "@/db/schema";

export async function LeaderboardSection() {
	"use cache";
	cacheLife("hours");

	const [items, [countResult]] = await Promise.all([
		db
			.select()
			.from(roasts)
			.where(sql`${roasts.isPrivate} = false`)
			.orderBy(asc(roasts.score))
			.limit(3),
		db
			.select({ count: sql<number>`count(*)::int` })
			.from(roasts)
			.where(sql`${roasts.isPrivate} = false`),
	]);

	const totalCount = countResult?.count ?? 0;

	return (
		<>
			<div className="border border-border-primary bg-bg-surface overflow-hidden mt-4">
				<LeaderboardHeader />
				{items.map((roast, index) => (
					<LeaderboardRow
						key={roast.id}
						rank={`#${index + 1}`}
						score={roast.score.toString()}
						language={roast.language}
						code={roast.code}
					>
						<CodeBlock
							code={roast.code}
							lang={roast.language}
							className="border-none"
							withHeader={false}
						/>
					</LeaderboardRow>
				))}
				{items.length === 0 && (
					<div className="p-8 text-center text-text-tertiary font-mono text-sm">
						{"//"} no roasts yet. be the first?
					</div>
				)}
			</div>

			<div className="flex justify-center pt-8">
				<div className="text-text-tertiary font-mono text-xs opacity-50 flex items-center gap-1">
					<span>
						showing top {items.length} of {totalCount.toLocaleString()} ·
					</span>
					<Link
						href="/leaderboard"
						className="hover:text-text-primary transition-colors underline-offset-4 hover:underline"
					>
						view full leaderboard {">"}
					</Link>
				</div>
			</div>
		</>
	);
}
