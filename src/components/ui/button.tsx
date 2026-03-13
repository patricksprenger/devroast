import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const button = tv({
	base: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-[13px] font-medium font-mono transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-green cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
	variants: {
		variant: {
			primary: "bg-accent-green text-bg-page hover:opacity-90",
			secondary: "bg-bg-elevated text-text-primary hover:bg-bg-elevated/80",
			outline:
				"border border-border-primary bg-transparent hover:bg-bg-input text-text-primary",
			ghost: "hover:bg-bg-input text-text-primary",
			link: "text-accent-green underline-offset-4 hover:underline",
		},
		size: {
			default: "h-10 px-6 py-2.5",
			sm: "h-8 px-3 text-xs",
			lg: "h-12 px-8 text-base",
			icon: "h-10 w-10",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "default",
	},
});

export interface ButtonProps
	extends ComponentProps<"button">,
		VariantProps<typeof button> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
	return (
		<button
			type="button"
			className={cn(button({ variant, size }), className)}
			{...props}
		/>
	);
}
