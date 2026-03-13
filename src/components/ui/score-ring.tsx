import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const scoreRing = tv({
	base: "relative inline-flex items-center justify-center font-mono",
});

export interface ScoreRingProps
	extends ComponentProps<"div">,
		VariantProps<typeof scoreRing> {
	score: number;
	maxScore?: number;
}

export function ScoreRing({
	score,
	maxScore = 10,
	className,
	...props
}: ScoreRingProps) {
	const radius = 86;
	const circumference = 2 * Math.PI * radius;
	const percentage = (score / maxScore) * 100;
	const offset = circumference - (percentage / 100) * circumference;

	// Determine color based on score
	const getScoreColor = () => {
		if (score >= 8) return "var(--color-accent-green)";
		if (score >= 5) return "var(--color-accent-amber)";
		return "var(--color-accent-red)";
	};

	return (
		<div className={cn(scoreRing(), className)} {...props}>
			<svg
				width="180"
				height="180"
				viewBox="0 0 180 180"
				className="-rotate-90"
				role="img"
				aria-label={`Score: ${score} out of ${maxScore}`}
			>
				{/* Background Ring */}
				<circle
					cx="90"
					cy="90"
					r={radius}
					fill="transparent"
					stroke="var(--color-border-primary)"
					strokeWidth="4"
				/>
				{/* Progress Ring */}
				<circle
					cx="90"
					cy="90"
					r={radius}
					fill="transparent"
					stroke={getScoreColor()}
					strokeWidth="4"
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					strokeLinecap="round"
					className="transition-all duration-1000 ease-out"
				/>
			</svg>

			<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
				<div className="flex items-baseline gap-1">
					<span className="text-[48px] font-bold text-text-primary leading-none">
						{score}
					</span>
					<span className="text-base text-text-tertiary leading-none">
						/{maxScore}
					</span>
				</div>
			</div>
		</div>
	);
}
