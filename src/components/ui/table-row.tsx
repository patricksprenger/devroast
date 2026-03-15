import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const tableRow = tv({
	base: "flex items-center gap-6 px-5 py-4 border-b border-border-primary font-mono group hover:bg-bg-surface/50 transition-colors",
});

const cell = tv({
	base: "overflow-hidden text-ellipsis whitespace-nowrap",
	variants: {
		type: {
			rank: "w-10 text-text-tertiary text-[13px]",
			score: "w-[60px] text-accent-red font-bold text-[13px]",
			lang: "w-[100px] text-text-tertiary text-xs text-right",
		},
	},
});

export interface TableRowProps
	extends ComponentProps<"div">,
		VariantProps<typeof tableRow> {
	rank: string;
	score: string;
	language: string;
}

export function TableRow({
	rank,
	score,
	language,
	className,
	...props
}: TableRowProps) {
	return (
		<div className={cn(tableRow(), className)} {...props}>
			<div className={cell({ type: "rank" })}>{rank}</div>
			<div className={cell({ type: "score" })}>{score}</div>
			<div className="flex-1" />
			<div className={cell({ type: "lang" })}>{language}</div>
		</div>
	);
}
