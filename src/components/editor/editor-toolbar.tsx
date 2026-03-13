import { Check, Copy, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LanguageSelector } from "./language-selector";

interface EditorToolbarProps {
	language: string;
	onLanguageChange: (value: string) => void;
	onFormat: () => void;
	onCopy: () => void;
	characterCount: number;
	maxCharacters: number;
}

export function EditorToolbar({
	language,
	onLanguageChange,
	onFormat,
	onCopy,
	characterCount,
	maxCharacters,
}: EditorToolbarProps) {
	const [copied, setCopied] = useState(false);
	const isOverLimit = characterCount > maxCharacters;

	const handleCopy = () => {
		onCopy();
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="flex items-center justify-between gap-4 px-4 h-12 border-t border-border-primary bg-bg-surface">
			<div className="flex items-center gap-2">
				<LanguageSelector value={language} onChange={onLanguageChange} />
				<Button
					variant="ghost"
					size="sm"
					onClick={onFormat}
					className="text-text-secondary hover:text-text-primary gap-1.5"
				>
					<Sparkles size={14} className="text-accent-green" />
					<span>Format</span>
				</Button>
			</div>

			<div className="flex items-center gap-4">
				<div
					className={cn(
						"text-[11px] font-mono transition-colors",
						isOverLimit ? "text-accent-red" : "text-text-tertiary",
					)}
				>
					{characterCount.toLocaleString()} / {maxCharacters.toLocaleString()}
				</div>

				<Button
					variant="ghost"
					size="sm"
					onClick={handleCopy}
					className="text-text-secondary hover:text-text-primary gap-1.5"
				>
					{copied ? (
						<>
							<Check size={14} className="text-accent-green" />
							<span>Copied!</span>
						</>
					) : (
						<>
							<Copy size={14} />
							<span>Copy</span>
						</>
					)}
				</Button>
			</div>
		</div>
	);
}
