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
	const lineCount = code.trim().split("\n").length;
	const isCollapsible = lineCount > 4;

	return (
		<Collapsible.Root
			open={isOpen}
			onOpenChange={setIsOpen}
			className="group/collapsible border-b border-border-primary last:border-0 flex flex-col"
		>
			{/* Meta Row */}
			<TableRow
				rank={rank}
				score={score}
				codePreview=""
				language={language}
				className="border-none hover:bg-transparent"
			/>

			<div className="px-5 pb-5 flex flex-col">
				<div className="relative">
					<Collapsible.Panel
						keepMounted
						className={cn(
							"overflow-hidden transition-[max-height] duration-300 ease-in-out",
							isCollapsible
								? isOpen
									? "max-h-[2000px]"
									: "max-h-[100px]"
								: "max-h-none",
						)}
					>
						<div className="border border-border-primary/50">{children}</div>
					</Collapsible.Panel>

					{!isOpen && isCollapsible && (
						<div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-bg-surface to-transparent pointer-events-none" />
					)}
				</div>

				{isCollapsible && (
					<div className="mt-3 flex justify-start">
						<Collapsible.Trigger className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-text-tertiary hover:text-text-primary transition-colors uppercase tracking-widest outline-none group">
							<span>{isOpen ? "show less" : "show more"}</span>
							<ChevronDown
								className={cn(
									"w-3 h-3 transition-transform duration-200",
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
