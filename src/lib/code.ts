import hljs from "highlight.js";

export const SUPPORTED_LANGUAGES = [
	{ id: "plaintext", name: "Plain Text", extension: "txt" },
	{ id: "javascript", name: "JavaScript", extension: "js" },
	{ id: "typescript", name: "TypeScript", extension: "ts" },
	{ id: "python", name: "Python", extension: "py" },
	{ id: "rust", name: "Rust", extension: "rs" },
	{ id: "go", name: "Go", extension: "go" },
	{ id: "cpp", name: "C++", extension: "cpp" },
	{ id: "html", name: "HTML", extension: "html" },
	{ id: "css", name: "CSS", extension: "css" },
	{ id: "json", name: "JSON", extension: "json" },
	{ id: "markdown", name: "Markdown", extension: "md" },
];

export function detectLanguage(code: string): string {
	if (!code.trim()) return "plaintext";

	const result = hljs.highlightAuto(
		code,
		SUPPORTED_LANGUAGES.map((l) => l.id).filter((id) => id !== "plaintext"),
	);

	if (result.relevance > 5) {
		return result.language || "plaintext";
	}

	return "plaintext";
}

export async function formatCode(
	code: string,
	language: string,
): Promise<string> {
	// For now, we'll implement a simple trim.
	// In a real scenario, we could call a server-side Biome formatter or a client-side Prettier.
	return code.trim();
}
