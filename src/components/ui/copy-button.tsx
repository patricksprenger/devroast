"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface CopyButtonProps {
	code: string;
	className?: string;
}

export function CopyButton({ code, className }: CopyButtonProps) {
	const [hasCopied, setHasCopied] = useState(false);

	async function copyToClipboard() {
		await navigator.clipboard.writeText(code);
		setHasCopied(true);
		setTimeout(() => setHasCopied(false), 2000);
	}

	return (
		<Button
			size="icon"
			variant="ghost"
			className={cn(
				"h-8 w-8 text-text-secondary hover:text-text-primary",
				className,
			)}
			onClick={copyToClipboard}
		>
			{hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
			<span className="sr-only">Copy code</span>
		</Button>
	);
}
