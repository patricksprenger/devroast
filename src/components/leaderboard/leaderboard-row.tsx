"use client";

import { Collapsible } from "@base-ui/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { TableRow } from "@/components/ui/table-row";
import { cn } from "@/lib/utils";

interface LeaderboardRowProps {
	rank: string;
	score: string;
	language: string;
	code: string;
	children: React.ReactNode;
}

export function LeaderboardRow({
	rank,
	score,
	language,
	code,
	children,
}: LeaderboardRowProps) {
	const [isOpen, setIsOpen] = useState(false);
	const lines = code.trim().split("\n");
	const lineCount = lines.length;
	const isCollapsible = lineCount > 4;

	// Use the first line as a preview for the TableRow column
	const codePreview = lines[0] || "";

	return (
		<Collapsible.Root
			open={isOpen}
			onOpenChange={setIsOpen}
			className="group/collapsible border-b border-border-primary last:border-0 flex flex-col"
		>
			{/* Meta Row - Restoring the code preview in the column */}
			<TableRow
				rank={rank}
				score={score}
				codePreview={codePreview}
				language={language}
				className="border-none hover:bg-transparent"
			/>

			<div className="px-5 pb-5 flex flex-col">
				<div className="relative">
					<div
						className={cn(
							"overflow-hidden transition-[max-height] duration-500 ease-in-out border border-border-primary/50",
							isCollapsible
								? isOpen
									? "max-h-[2000px]"
									: "max-h-[118px]" // Roughly 4 lines of code (21px line height * 4 + 32px padding)
								: "max-h-none",
						)}
					>
						{children}
					</div>

					{!isOpen && isCollapsible && (
						<div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-bg-surface/90 to-transparent pointer-events-none" />
					)}
				</div>

				{isCollapsible && (
					<div className="mt-3 flex justify-start">
						<Collapsible.Trigger className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-text-tertiary hover:text-text-primary transition-colors uppercase tracking-widest outline-none group">
							<span>{isOpen ? "show less" : "show more"}</span>
							<ChevronDown
								className={cn(
									"w-3 h-3 transition-transform duration-300",
									isOpen && "rotate-180",
								)}
							/>
						</Collapsible.Trigger>
					</div>
				)}
			</div>
		</Collapsible.Root>
	);
}
