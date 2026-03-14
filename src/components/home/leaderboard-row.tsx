"use client";

import { Collapsible } from "@base-ui/react";
import { ChevronDown } from "lucide-react";
import { TableRow } from "@/components/ui/table-row";

interface LeaderboardRowProps {
	rank: string;
	score: string;
	codePreview: string;
	language: string;
	children: React.ReactNode;
}

export function LeaderboardRow({
	rank,
	score,
	codePreview,
	language,
	children,
}: LeaderboardRowProps) {
	return (
		<Collapsible.Root className="group/collapsible border-b border-border-primary last:border-0">
			<Collapsible.Trigger className="w-full text-left outline-none">
				<div className="flex items-center gap-6 pr-5 transition-colors group-data-[state=open]/collapsible:bg-bg-surface/30 hover:bg-bg-surface/50">
					<TableRow
						rank={rank}
						score={score}
						codePreview={codePreview}
						language={language}
						className="border-none cursor-pointer flex-1 pr-0 hover:bg-transparent"
					/>
					<ChevronDown className="w-4 h-4 text-text-tertiary transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
				</div>
			</Collapsible.Trigger>
			<Collapsible.Panel className="overflow-hidden transition-[height] duration-200 ease-out data-[state=closed]:h-0">
				<div className="p-4 bg-bg-surface/5 border-t border-border-primary/30 max-h-[400px] overflow-y-auto">
					{children}
				</div>
			</Collapsible.Panel>
		</Collapsible.Root>
	);
}
