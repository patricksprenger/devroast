import { RangeSetBuilder, StateEffect, StateField } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	EditorView,
	ViewPlugin,
	type ViewUpdate,
} from "@codemirror/view";
import { getHighlighter } from "./shiki-runtime";

const setHighlighting = StateEffect.define<DecorationSet>();

const highlightingField = StateField.define<DecorationSet>({
	create() {
		return Decoration.none;
	},
	update(decorations, tr) {
		for (const e of tr.effects) {
			if (e.is(setHighlighting)) return e.value;
		}
		return decorations.map(tr.changes);
	},
	provide: (f) => EditorView.decorations.from(f),
});

export function shikiHighlighting(language: string) {
	return [
		highlightingField,
		ViewPlugin.fromClass(
			class {
				constructor(readonly view: EditorView) {
					this.highlight(view);
				}

				update(update: ViewUpdate) {
					if (update.docChanged || update.viewportChanged) {
						this.highlight(update.view);
					}
				}

				async highlight(view: EditorView) {
					const highlighter = await getHighlighter();
					const code = view.state.doc.toString();

					// We only highlight what's visible for performance
					const { from, to } = view.viewport;

					try {
						const tokens = highlighter.codeToTokens(code, {
							lang: (language === "plaintext" ? "text" : language) as any,
							theme: "vesper",
						});

						const builder = new RangeSetBuilder<Decoration>();
						let currentPos = 0;

						for (const line of tokens.tokens) {
							for (const token of line) {
								const start = currentPos;
								const end = currentPos + token.content.length;

								if (end > from && start < to) {
									const decoration = Decoration.mark({
										attributes: { style: `color: ${token.color}` },
									});
									builder.add(
										Math.max(start, from),
										Math.min(end, to),
										decoration,
									);
								}
								currentPos = end;
							}
							currentPos += 1; // for the newline character
						}

						view.dispatch({
							effects: setHighlighting.of(builder.finish()),
						});
					} catch (e) {
						console.error("Shiki highlighting error:", e);
					}
				}
			},
		),
	];
}
