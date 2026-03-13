"use client";

import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { bracketMatching, indentOnInput } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import {
	drawSelection,
	EditorView,
	highlightActiveLine,
	keymap,
	lineNumbers,
} from "@codemirror/view";
import { useCallback, useEffect, useRef, useState } from "react";
import { detectLanguage, formatCode } from "@/lib/code";
import { cn } from "@/lib/utils";
import { devRoastTheme } from "./editor-theme";
import { EditorToolbar } from "./editor-toolbar";
import { shikiHighlighting } from "./shiki-extension";

interface CodeEditorProps {
	initialValue?: string;
	onChange?: (value: string) => void;
	className?: string;
	maxCharacters?: number;
}

export function CodeEditor({
	initialValue = "",
	onChange,
	className,
	maxCharacters = 10000,
}: CodeEditorProps) {
	const editorRef = useRef<HTMLDivElement>(null);
	const viewRef = useRef<EditorView | null>(null);
	const [language, setLanguage] = useState("plaintext");
	const [code, setCode] = useState(initialValue);
	const characterCount = code.length;

	// Persistence
	useEffect(() => {
		const savedCode = localStorage.getItem("devroast-code");
		const savedLang = localStorage.getItem("devroast-lang");
		if (savedCode && !initialValue) {
			setCode(savedCode);
		}
		if (savedLang) {
			setLanguage(savedLang);
		}
	}, [initialValue]);

	const syncCode = useCallback(
		(newCode: string) => {
			setCode(newCode);
			onChange?.(newCode);
			localStorage.setItem("devroast-code", newCode);
		},
		[onChange],
	);

	const syncLanguage = useCallback((newLang: string) => {
		setLanguage(newLang);
		localStorage.setItem("devroast-lang", newLang);
	}, []);

	const isFirstRender = useRef(true);

	const lastLanguage = useRef(language);

	useEffect(() => {
		if (!editorRef.current) return;

		const languageChanged = lastLanguage.current !== language;
		if (viewRef.current && !isFirstRender.current && !languageChanged) {
			return;
		}

		lastLanguage.current = language;

		// Only set initial code once from localStorage or initialValue
		let startCode = code;
		if (isFirstRender.current) {
			const savedCode = localStorage.getItem("devroast-code");
			if (savedCode && !initialValue) {
				startCode = savedCode;
				setCode(savedCode);
			}
			isFirstRender.current = false;
		}

		const state = EditorState.create({
			doc: startCode,
			extensions: [
				history(),
				keymap.of([...defaultKeymap, ...historyKeymap]),
				lineNumbers(),
				highlightActiveLine(),
				drawSelection(),
				indentOnInput(),
				bracketMatching(),
				devRoastTheme,
				shikiHighlighting(language),
				EditorView.updateListener.of((update) => {
					if (update.docChanged) {
						const newValue = update.state.doc.toString();
						syncCode(newValue);
					}
				}),
				EditorView.domEventHandlers({
					paste: (event) => {
						const pastedText = event.clipboardData?.getData("text/plain");
						if (pastedText) {
							const detected = detectLanguage(pastedText);
							if (detected !== "plaintext") {
								syncLanguage(detected);
							}
						}
					},
				}),
			],
		});

		const view = new EditorView({
			state,
			parent: editorRef.current,
		});

		viewRef.current = view;

		return () => {
			view.destroy();
			viewRef.current = null;
		};
	}, [language, syncCode, syncLanguage, code, initialValue]);

	const handleFormat = async () => {
		const formatted = await formatCode(code, language);
		if (viewRef.current) {
			const transaction = viewRef.current.state.update({
				changes: {
					from: 0,
					to: viewRef.current.state.doc.length,
					insert: formatted,
				},
			});
			viewRef.current.dispatch(transaction);
		}
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(code);
	};

	return (
		<div
			className={cn(
				"flex flex-col w-full overflow-hidden border border-border-primary bg-bg-input shadow-2xl",
				className,
			)}
		>
			{/* ray-so Style Window Header */}
			<div className="flex items-center h-10 px-4 border-b border-border-primary bg-bg-surface/50">
				<div className="flex gap-1.5">
					<div className="w-3.5 h-3.5 rounded-full bg-accent-red/20 border border-accent-red/30" />
					<div className="w-3.5 h-3.5 rounded-full bg-accent-amber/20 border border-accent-amber/30" />
					<div className="w-3.5 h-3.5 rounded-full bg-accent-green/20 border border-accent-green/30" />
				</div>
				<div className="flex-1 text-center">
					<span className="text-[11px] font-mono text-text-tertiary uppercase tracking-widest">
						{language}
					</span>
				</div>
				<div className="w-14" /> {/* Spacer to balance traffic lights */}
			</div>

			{/* Editor Content */}
			<div className="relative flex-1 min-h-[400px]">
				<div ref={editorRef} className="absolute inset-0 h-full" />
			</div>

			{/* Toolbar */}
			<EditorToolbar
				language={language}
				onLanguageChange={syncLanguage}
				onFormat={handleFormat}
				onCopy={handleCopy}
				characterCount={characterCount}
				maxCharacters={maxCharacters}
			/>
		</div>
	);
}
