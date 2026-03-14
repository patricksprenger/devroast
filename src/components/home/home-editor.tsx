"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CodeEditor } from "@/components/editor/code-editor";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/client";

const DEFAULT_CODE = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  
  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }
  
  return total;
}`;

const MAX_CHARACTERS = 10000;

interface HomeEditorProps {
	statsFooter: React.ReactNode;
}

export function HomeEditor({ statsFooter }: HomeEditorProps) {
	const router = useRouter();
	const [isRoastMode, setIsRoastMode] = useState(true);
	const [code, setCode] = useState(DEFAULT_CODE);
	const [language, setLanguage] = useState("plaintext");

	const { mutate: createRoast, isPending } = api.createRoast.useMutation({
		onSuccess: (data) => {
			router.push(`/roast/${data.id}`);
		},
	});

	const handleRoast = () => {
		createRoast({
			code,
			language,
			mode: isRoastMode ? "sarcasm" : "technical",
		});
	};

	const isOverLimit = code.length > MAX_CHARACTERS;
	const isEmpty = code.trim().length === 0;

	return (
		<div className="w-full max-w-[780px] space-y-8">
			<CodeEditor
				initialValue={DEFAULT_CODE}
				onChange={setCode}
				onLanguageChange={setLanguage}
				maxCharacters={MAX_CHARACTERS}
				className="min-h-[420px]"
			/>

			{/* Actions Bar */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-3">
						<Toggle
							checked={isRoastMode}
							onCheckedChange={setIsRoastMode}
							id="roast-mode"
						/>
						<label
							htmlFor="roast-mode"
							className={cn(
								"text-[13px] font-mono cursor-pointer select-none transition-colors",
								isRoastMode ? "text-accent-green" : "text-text-secondary",
							)}
						>
							roast mode
						</label>
					</div>
					<span className="text-text-tertiary font-mono text-xs">
						{isOverLimit ? (
							<span className="text-accent-red">{"//"} code too long</span>
						) : (
							<span>{"//"} maximum sarcasm enabled</span>
						)}
					</span>
				</div>
				<Button
					className="font-bold py-2.5 px-8"
					disabled={isOverLimit || isEmpty || isPending}
					onClick={handleRoast}
				>
					{isPending ? "$ roasting..." : "$ roast_my_code"}
				</Button>
			</div>

			{statsFooter}
		</div>
	);
}
