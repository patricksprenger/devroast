import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const diffLine = tv({
	base: "flex items-center gap-2 px-4 py-2 font-mono text-[13px] transition-colors",
	variants: {
		type: {
			added: "bg-[#0A1A0F] text-text-primary",
			removed: "bg-[#1A0A0A] text-text-secondary",
			context: "bg-transparent text-text-secondary",
		},
	},
	defaultVariants: {
		type: "context",
	},
});

const diffPrefix = tv({
	base: "shrink-0 select-none w-3",
	variants: {
		type: {
			added: "text-accent-green",
			removed: "text-accent-red",
			context: "text-text-tertiary",
		},
	},
});

export interface DiffLineProps
	extends ComponentProps<"div">,
		VariantProps<typeof diffLine> {
	code: string;
}

export function DiffLine({ className, type, code, ...props }: DiffLineProps) {
	const prefix = type === "added" ? "+" : type === "removed" ? "-" : " ";

	return (
		<div className={cn(diffLine({ type }), className)} {...props}>
			<span className={diffPrefix({ type })}>{prefix}</span>
			<code className="whitespace-pre">{code}</code>
		</div>
	);
}
