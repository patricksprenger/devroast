import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const input = tv({
	base: "flex h-10 w-full rounded-none border border-border-primary bg-bg-input px-3 py-2 text-sm font-mono ring-offset-bg-page file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-green disabled:cursor-not-allowed disabled:opacity-50",
	variants: {
		variant: {
			default: "",
			error: "border-accent-red focus-visible:ring-accent-red",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export interface InputProps
	extends ComponentProps<"input">,
		VariantProps<typeof input> {}

export function Input({ className, variant, ...props }: InputProps) {
	return <input className={cn(input({ variant }), className)} {...props} />;
}
