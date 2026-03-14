import Link from "next/link";
import { Suspense } from "react";
import { HomeEditor } from "@/components/home/home-editor";
import { LeaderboardSection } from "@/components/home/leaderboard-section";
import { LeaderboardSkeleton } from "@/components/home/leaderboard-skeleton";
import { StatsFooter } from "@/components/metrics/stats-footer";

export default function Home() {
	return (
		<div className="flex flex-col items-center px-10 py-20 space-y-16">
			{/* Hero Section */}
			<section className="flex flex-col items-center text-center space-y-3 max-w-[780px]">
				<h1 className="text-4xl font-bold font-mono tracking-tight flex items-center gap-4">
					<span className="text-accent-green">$</span>
					<span>paste your code. get roasted.</span>
				</h1>
				<p className="text-text-secondary font-mono text-sm tracking-wide">
					{"//"} drop your code below and we'll rate it — brutally honest or
					full roast mode
				</p>
			</section>

			{/* Editor Area */}
			<HomeEditor statsFooter={<StatsFooter />} />

			<div className="h-10" />

			{/* Leaderboard Preview Section */}
			<section className="w-full max-w-[960px] space-y-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3 font-mono font-bold">
						<span className="text-accent-green">{"//"}</span>
						<span className="text-text-primary text-sm uppercase tracking-widest">
							shame_leaderboard
						</span>
					</div>
					<Link
						href="/leaderboard"
						className="text-text-secondary hover:text-text-primary font-mono text-xs transition-colors border border-border-primary px-3 py-1.5"
					>
						$ view_all {">>"}
					</Link>
				</div>

				<p className="text-text-tertiary font-mono text-[13px]">
					{"//"} the worst code on the internet, ranked by shame
				</p>

				<Suspense fallback={<LeaderboardSkeleton />}>
					<LeaderboardSection />
				</Suspense>
			</section>

			<div className="h-20" />
		</div>
	);
}
