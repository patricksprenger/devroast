"use client";

import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

export function ToggleDemo() {
	const [checked, setChecked] = useState(true);

	return (
		<div className="flex items-center gap-4">
			<Toggle
				checked={checked}
				onCheckedChange={setChecked}
				id="mode-interactive"
			/>
			<label
				htmlFor="mode-interactive"
				className={cn(
					"text-sm transition-colors cursor-pointer select-none",
					checked ? "text-accent-green" : "text-text-secondary",
				)}
			>
				roast mode
			</label>
		</div>
	);
}
