import { CodeBlock } from "@/components/ui/code-block";
import { cn } from "@/lib/utils";

const LEADERBOARD_ENTRIES = [
	{
		rank: 1,
		score: "1.2",
		language: "javascript",
		lines: 3,
		code: `eval(prompt("enter code"))
document.write(response)
// trust the user lol`,
	},
	{
		rank: 2,
		score: "1.8",
		language: "typescript",
		lines: 3,
		code: `if (x == true) { return true; }
else if (x == false) { return false; }
else { return !false; }`,
	},
	{
		rank: 3,
		score: "2.1",
		language: "sql",
		lines: 2,
		code: `SELECT * FROM users WHERE 1=1
-- TODO: add authentication`,
	},
	{
		rank: 4,
		score: "2.5",
		language: "python",
		lines: 3,
		code: `def login(user, password):
    if user == "admin" and password == "admin":
      return True`,
	},
	{
		rank: 5,
		score: "3.0",
		language: "javascript",
		lines: 3,
		code: `while(true) {
  console.log("I am productive");
}`,
	},
];

export default function LeaderboardPage() {
	return (
		<div className="flex flex-col min-h-screen bg-bg-page">
			<div className="flex flex-col gap-10 px-20 py-10 max-w-[1440px] mx-auto w-full">
				{/* Hero Section */}
				<section className="flex flex-col gap-4 w-full">
					<div className="flex items-center gap-3">
						<span className="text-accent-green font-mono font-bold text-[32px]">
							{">"}
						</span>
						<h1 className="text-text-primary font-mono font-bold text-[28px]">
							shame_leaderboard
						</h1>
					</div>
					<p className="text-text-secondary font-mono text-sm">
						{"//"} the most roasted code on the internet
					</p>
					<div className="flex items-center gap-2 font-mono text-xs text-text-tertiary">
						<span>2,847 submissions</span>
						<span>·</span>
						<span>avg score: 4.2/10</span>
					</div>
				</section>

				{/* Leaderboard Entries */}
				<div className="flex flex-col gap-5 w-full">
					{LEADERBOARD_ENTRIES.map((entry) => (
						<div
							key={entry.rank}
							className="flex flex-col border border-border-primary"
						>
							{/* Meta Row */}
							<div className="flex items-center justify-between h-12 px-5 border-b border-border-primary">
								<div className="flex items-center gap-4">
									<div className="flex items-center gap-1.5 font-mono text-[13px]">
										<span className="text-text-tertiary">#</span>
										<span className="text-accent-amber font-bold">
											{entry.rank}
										</span>
									</div>
									<div className="flex items-center gap-1.5 font-mono text-[13px]">
										<span className="text-text-tertiary text-xs">score</span>
										<span className="text-accent-red font-bold">
											{entry.score}
										</span>
									</div>
								</div>
								<div className="flex items-center gap-3 font-mono text-xs">
									<span className="text-text-secondary">{entry.language}</span>
									<span className="text-text-tertiary">
										{entry.lines} lines
									</span>
								</div>
							</div>

							{/* Code Block */}
							<CodeBlock
								code={entry.code}
								lang={entry.language}
								className="border-none"
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
