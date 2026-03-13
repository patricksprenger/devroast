import { ChevronDown } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/lib/code";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
	value: string;
	onChange: (value: string) => void;
	className?: string;
}

export function LanguageSelector({
	value,
	onChange,
	className,
}: LanguageSelectorProps) {
	return (
		<div className={cn("relative inline-block", className)}>
			<select
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="appearance-none bg-bg-elevated border border-border-primary text-text-secondary hover:text-text-primary h-8 pl-3 pr-8 text-xs font-mono cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-accent-green rounded-none"
			>
				{SUPPORTED_LANGUAGES.map((lang) => (
					<option key={lang.id} value={lang.id}>
						{lang.name}
					</option>
				))}
			</select>
			<div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary">
				<ChevronDown size={14} />
			</div>
		</div>
	);
}
