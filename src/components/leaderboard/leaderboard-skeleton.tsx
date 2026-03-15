import { LeaderboardHeader } from "./leaderboard-header";

interface LeaderboardSkeletonProps {
	count?: number;
}

export function LeaderboardSkeleton({ count = 3 }: LeaderboardSkeletonProps) {
	return (
		<div className="border border-border-primary bg-bg-surface overflow-hidden mt-4 animate-pulse">
			<LeaderboardHeader />
			{[...Array(count)].map((_, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: skeleton
					key={i}
					className="flex flex-col border-b border-border-primary last:border-0"
				>
					{/* Meta Line */}
					<div className="flex items-center gap-6 px-5 py-4">
						<div className="h-4 w-10 bg-border-primary rounded-none" />
						<div className="h-4 w-[60px] bg-border-primary rounded-none" />
						<div className="flex-1" />
						<div className="h-4 w-[100px] bg-border-primary rounded-none" />
					</div>
					{/* Code Block Placeholder */}
					<div className="px-5 pb-5">
						<div className="h-24 w-full bg-border-primary/30 rounded-none border border-border-primary/50" />
					</div>
				</div>
			))}
		</div>
	);
}
