import Link from "next/link";
import { HomeEditor } from "@/components/home/home-editor";
import { StatsFooter } from "@/components/metrics/stats-footer";
import { TableRow } from "@/components/ui/table-row";

export default function Home() {
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
			<HomeEditor statsFooter={<StatsFooter />} />

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
					<div className="text-text-tertiary font-mono text-xs opacity-50 flex items-center gap-1">
						<span>showing top 3 ·</span>
						<Link
							href="/leaderboard"
							className="hover:text-text-primary transition-colors underline-offset-4 hover:underline"
						>
							view full leaderboard {">"}
						</Link>
					</div>
				</div>
			</section>

			<div className="h-20" />
		</div>
	);
}
