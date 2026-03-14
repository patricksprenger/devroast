import Link from "next/link";
import { TableRow } from "@/components/ui/table-row";
import { api } from "@/trpc/server";
import { LeaderboardHeader } from "./leaderboard-header";

export async function LeaderboardSection() {
	const { items, totalCount } = await api.getLeaderboard();

	return (
		<>
			<div className="border border-border-primary bg-bg-surface overflow-hidden mt-4">
				<LeaderboardHeader />
				{items.map((roast, index) => (
					<TableRow
						key={roast.id}
						rank={`#${index + 1}`}
						score={roast.score.toString()}
						codePreview={roast.roastQuote}
						language={roast.language}
					/>
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
