import { createHighlighter, type Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

export function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: ["vesper"],
			langs: [
				"javascript",
				"typescript",
				"python",
				"rust",
				"go",
				"cpp",
				"html",
				"css",
				"json",
				"markdown",
			],
		});
	}
	return highlighterPromise;
}
