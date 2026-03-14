"use client";

import NumberFlow from "@number-flow/react";
import { api } from "@/trpc/client";

export function LeaderboardHeroMetrics() {
	const { data } = api.getMetrics.useQuery();
	const totalRoasts = data?.totalRoasts ?? 0;
	const avgScore = data?.avgScore ?? 0;

	return (
		<div className="flex items-center gap-2 font-mono text-xs text-text-tertiary">
			<div className="flex items-center gap-1">
				<NumberFlow value={totalRoasts} />
				<span>submissions</span>
			</div>
			<span>·</span>
			<div className="flex items-center gap-1">
				<span>avg score:</span>
				<NumberFlow
					value={avgScore}
					format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
				/>
				<span>/10</span>
			</div>
		</div>
	);
}
