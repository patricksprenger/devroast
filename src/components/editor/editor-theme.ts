import { EditorView } from "@codemirror/view";

export const devRoastTheme = EditorView.theme({
	"&": {
		backgroundColor: "transparent",
		height: "100%",
	},
	".cm-content": {
		fontFamily: "var(--font-mono)",
		fontSize: "14px",
		padding: "20px 0",
	},
	".cm-line": {
		padding: "0 24px",
		lineHeight: "1.6",
	},
	"&.cm-focused": {
		outline: "none",
	},
	".cm-gutters": {
		backgroundColor: "transparent",
		border: "none",
		color: "var(--color-text-tertiary)",
		fontFamily: "var(--font-mono)",
		fontSize: "12px",
		minWidth: "40px",
	},
	".cm-gutterElement": {
		padding: "0 8px 0 16px !important",
		display: "flex",
		justifyContent: "flex-end",
	},
	".cm-activeLine": {
		backgroundColor: "rgba(255, 255, 255, 0.03)",
	},
	".cm-activeLineGutter": {
		backgroundColor: "transparent",
		color: "var(--color-text-secondary)",
	},
	".cm-cursor": {
		borderLeft: "2px solid var(--color-accent-green)",
	},
	"&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
		{
			backgroundColor: "rgba(16, 185, 129, 0.2) !important",
		},
	".cm-panels": {
		backgroundColor: "var(--color-bg-input)",
		color: "var(--color-text-primary)",
	},
	".cm-panels.cm-panels-top": {
		borderBottom: "2px solid var(--color-border-primary)",
	},
	".cm-panels.cm-panels-bottom": {
		borderTop: "2px solid var(--color-border-primary)",
	},
});
