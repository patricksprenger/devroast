import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const badge = tv({
	slots: {
		root: "inline-flex items-center gap-2 font-mono font-medium transition-colors",
		dot: "h-2 w-2 shrink-0 rounded-full",
	},
	variants: {
		variant: {
			critical: {
				root: "text-accent-red",
				dot: "bg-accent-red",
			},
			warning: {
				root: "text-accent-amber",
				dot: "bg-accent-amber",
			},
			good: {
				root: "text-accent-green",
				dot: "bg-accent-green",
			},
			info: {
				root: "text-accent-cyan",
				dot: "bg-accent-cyan",
			},
			neutral: {
				root: "text-text-secondary",
				dot: "bg-text-tertiary",
			},
		},
		size: {
			sm: {
				root: "text-xs gap-1.5",
				dot: "h-1.5 w-1.5",
			},
			default: {
				root: "text-[13px] gap-2",
				dot: "h-2 w-2",
			},
			lg: {
				root: "text-sm gap-2.5",
				dot: "h-2.5 w-2.5",
			},
		},
	},
	defaultVariants: {
		variant: "good",
		size: "default",
	},
});

export interface BadgeProps
	extends ComponentProps<"div">,
		VariantProps<typeof badge> {}

export function Badge({
	className,
	variant,
	size,
	children,
	...props
}: BadgeProps) {
	const { root, dot } = badge({ variant, size });
	return (
		<div className={cn(root(), className)} {...props}>
			<div className={dot()} />
			{children}
		</div>
	);
}
