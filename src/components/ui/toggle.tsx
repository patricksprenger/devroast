"use client";

import { Switch } from "@base-ui/react";
import { cn } from "@/lib/utils";

export interface ToggleProps extends Switch.Root.Props {}

export function Toggle({ className, ...props }: ToggleProps) {
	return (
		<Switch.Root
			{...props}
			className={(state) =>
				cn(
					"group inline-flex h-[22px] w-[40px] shrink-0 cursor-pointer items-center rounded-full border border-border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page disabled:cursor-not-allowed disabled:opacity-50",
					state.checked
						? "bg-accent-green border-accent-green"
						: "bg-bg-elevated",
					typeof className === "function" ? className(state) : className,
				)
			}
		>
			<Switch.Thumb
				className={(state) =>
					cn(
						"pointer-events-none block h-4 w-4 rounded-full shadow-lg ring-0 transition-all duration-200",
						state.checked
							? "translate-x-[21px] bg-bg-page"
							: "translate-x-[3px] bg-text-secondary",
					)
				}
			/>
		</Switch.Root>
	);
}
