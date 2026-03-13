import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const textarea = tv({
	base: "flex min-h-[80px] w-full rounded-none border border-border-primary bg-bg-input px-3 py-2 text-sm font-mono ring-offset-bg-page placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-green disabled:cursor-not-allowed disabled:opacity-50",
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

export interface TextareaProps
	extends ComponentProps<"textarea">,
		VariantProps<typeof textarea> {}

export function Textarea({ className, variant, ...props }: TextareaProps) {
	return (
		<textarea className={cn(textarea({ variant }), className)} {...props} />
	);
}
