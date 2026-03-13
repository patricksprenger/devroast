"use client";

import NumberFlow from "@number-flow/react";
import { api } from "@/trpc/client";

export function StatsFooter() {
	const { data } = api.getMetrics.useQuery();

	const totalRoasts = data?.totalRoasts ?? 0;
	const avgScore = data?.avgScore ?? 0;

	return (
		<div className="flex items-center justify-center gap-6 text-text-tertiary font-mono text-xs pt-4 opacity-60">
			<div className="flex items-center gap-1">
				<NumberFlow value={totalRoasts} />
				<span>codes roasted</span>
			</div>
			<span>·</span>
			<div className="flex items-center gap-1">
				<span>avg score:</span>
				<NumberFlow
					value={avgScore}
					format={{
						minimumFractionDigits: 1,
						maximumFractionDigits: 1,
					}}
				/>
				<span>/10</span>
			</div>
		</div>
	);
}
