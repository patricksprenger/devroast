export function LeaderboardHeader() {
	return (
		<div className="flex items-center gap-6 px-5 py-3 border-b border-border-primary bg-bg-surface font-mono text-[11px] uppercase tracking-wider text-text-tertiary">
			<div className="w-10">#</div>
			<div className="w-[60px]">score</div>
			<div className="flex-1">code</div>
			<div className="w-[100px] text-right">lang</div>
		</div>
	);
}
