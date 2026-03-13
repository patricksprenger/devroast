import { codeToHtml } from "shiki";
import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";

interface CodeBlockProps {
	code: string;
	lang?: string;
	filename?: string;
	className?: string;
}

export async function CodeBlock({
	code,
	lang = "typescript",
	filename,
	className,
}: CodeBlockProps) {
	const html = await codeToHtml(code, {
		lang,
		theme: "vesper",
	});

	return (
		<div
			className={cn(
				"group relative flex flex-col overflow-hidden border border-border-primary bg-bg-input font-mono",
				className,
			)}
		>
			<div className="flex items-center justify-between border-b border-border-primary bg-bg-page px-4 py-2">
				<div className="flex items-center gap-2">
					<div className="flex gap-1.5">
						<div className="h-3 w-3 rounded-full bg-accent-red" />
						<div className="h-3 w-3 rounded-full bg-accent-amber" />
						<div className="h-3 w-3 rounded-full bg-accent-green" />
					</div>
					{filename && (
						<span className="ml-2 text-xs text-text-secondary">{filename}</span>
					)}
				</div>
				<CopyButton code={code} />
			</div>
			<div
				className="overflow-x-auto p-4 text-[13px] leading-relaxed shiki-container"
				dangerouslySetInnerHTML={{ __html: html }}
			/>
			<style
				dangerouslySetInnerHTML={{
					__html: `
        .shiki-container pre {
          background-color: transparent !important;
          margin: 0;
        }
        .shiki-container code {
          counter-reset: line;
        }
      `,
				}}
			/>
		</div>
	);
}
