import { LeaderboardSkeleton } from "@/components/leaderboard/leaderboard-skeleton";

export default function LeaderboardLoading() {
	return (
		<div className="flex flex-col min-h-screen bg-bg-page">
			<div className="flex flex-col gap-10 px-20 py-10 max-w-[1440px] mx-auto w-full">
				{/* Hero Section Skeleton */}
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
					{/* Small metrics skeleton */}
					<div className="flex items-center gap-2 font-mono text-xs text-text-tertiary">
						<div className="h-4 w-24 bg-border-primary animate-pulse" />
						<span>·</span>
						<div className="h-4 w-32 bg-border-primary animate-pulse" />
					</div>
				</section>

				<LeaderboardSkeleton count={20} />
			</div>
		</div>
	);
}
