import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const card = tv({
	base: "flex flex-col rounded-none border border-border-primary bg-bg-surface text-text-primary shadow-sm",
	variants: {
		padding: {
			none: "p-0",
			sm: "p-4",
			default: "p-5", // 20px
			lg: "p-8",
		},
		gap: {
			none: "gap-0",
			sm: "gap-2",
			default: "gap-3", // 12px
			lg: "gap-4",
		},
	},
	defaultVariants: {
		padding: "default",
		gap: "default",
	},
});

export interface CardProps
	extends ComponentProps<"div">,
		VariantProps<typeof card> {}

export function Card({ className, padding, gap, ...props }: CardProps) {
	return <div className={cn(card({ padding, gap }), className)} {...props} />;
}
