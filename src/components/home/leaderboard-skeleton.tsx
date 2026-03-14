import { LeaderboardHeader } from "./leaderboard-header";

export function LeaderboardSkeleton() {
	return (
		<div className="border border-border-primary bg-bg-surface overflow-hidden mt-4 animate-pulse">
			<LeaderboardHeader />
			{[...Array(3)].map((_, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: skeleton
					key={i}
					className="flex items-center gap-6 px-5 py-4 border-b border-border-primary last:border-0"
				>
					<div className="h-4 w-10 bg-border-primary rounded" />
					<div className="h-4 w-[60px] bg-border-primary rounded" />
					<div className="h-4 flex-1 bg-border-primary rounded" />
					<div className="h-4 w-[100px] bg-border-primary rounded ml-auto" />
				</div>
			))}
		</div>
	);
}
