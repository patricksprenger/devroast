"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TableRow } from "@/components/ui/table-row";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

export default function Home() {
	const [isRoastMode, setIsRoastMode] = useState(true);

	return (
		<div className="flex flex-col items-center px-10 py-20 space-y-16">
			{/* Hero Section */}
			<section className="flex flex-col items-center text-center space-y-3 max-w-[780px]">
				<h1 className="text-4xl font-bold font-mono tracking-tight flex items-center gap-4">
					<span className="text-accent-green">$</span>
					<span>paste your code. get roasted.</span>
				</h1>
				<p className="text-text-secondary font-mono text-sm tracking-wide">
					{"//"} drop your code below and we'll rate it — brutally honest or
					full roast mode
				</p>
			</section>

			{/* Editor Area */}
			<div className="w-full max-w-[780px] space-y-8">
				<div className="border border-border-primary bg-bg-input overflow-hidden flex flex-col">
					{/* Window Header */}
					<div className="h-10 border-b border-border-primary bg-bg-page flex items-center px-4 justify-between">
						<div className="flex gap-1.5">
							<div className="h-3 w-3 rounded-full bg-accent-red" />
							<div className="h-3 w-3 rounded-full bg-accent-amber" />
							<div className="h-3 w-3 rounded-full bg-accent-green" />
						</div>
					</div>
					{/* Textarea */}
					<Textarea
						placeholder="Paste your code here..."
						className="min-h-[320px] border-none focus-visible:ring-0 bg-transparent resize-none p-6 text-[13px] leading-relaxed"
						defaultValue={`function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  
  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }
  
  return total;
}`}
					/>
				</div>

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
							{"//"} maximum sarcasm enabled
						</span>
					</div>
					<Button className="font-bold py-2.5 px-8">$ roast_my_code</Button>
				</div>

				{/* Stats Footer */}
				<div className="flex items-center justify-center gap-6 text-text-tertiary font-mono text-xs pt-4 opacity-60">
					<span>2,847 codes roasted</span>
					<span>·</span>
					<span>avg score: 4.2/10</span>
				</div>
			</div>

			<div className="h-10" />

			{/* Leaderboard Preview Section */}
			<section className="w-full max-w-[960px] space-y-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3 font-mono font-bold">
						<span className="text-accent-green">{"//"}</span>
						<span className="text-text-primary text-sm uppercase tracking-widest">
							shame_leaderboard
						</span>
					</div>
					<Link
						href="/leaderboard"
						className="text-text-secondary hover:text-text-primary font-mono text-xs transition-colors border border-border-primary px-3 py-1.5"
					>
						$ view_all {">>"}
					</Link>
				</div>

				<p className="text-text-tertiary font-mono text-[13px]">
					{"//"} the worst code on the internet, ranked by shame
				</p>

				<div className="border border-border-primary bg-bg-surface overflow-hidden mt-4">
					<TableRow
						rank="#1"
						score="1.2"
						codePreview='eval(prompt("enter code")); document.write(response); // trust user'
						language="javascript"
					/>
					<TableRow
						rank="#2"
						score="1.8"
						codePreview="if (x == true) { return true; } else if (x == false) { return false; }"
						language="typescript"
					/>
					<TableRow
						rank="#3"
						score="2.1"
						codePreview="SELECT * FROM users WHERE 1=1 -- TODO: add authentication"
						language="sql"
					/>
				</div>

				<div className="flex justify-center pt-8">
					<p className="text-text-tertiary font-mono text-xs opacity-50 flex items-center gap-1">
						<span>showing top 3 of 2,847 ·</span>
						<Link
							href="/leaderboard"
							className="hover:text-text-primary transition-colors underline-offset-4 hover:underline"
						>
							view full leaderboard {">"}
						</Link>
					</p>
				</div>
			</section>

			<div className="h-20" />
		</div>
	);
}
