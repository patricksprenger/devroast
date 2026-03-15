import { cacheLife } from "next/cache";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { TableRow } from "@/components/ui/table-row";
import { Toggle } from "@/components/ui/toggle";
import { ToggleDemo } from "./toggle-demo";

export default async function ExamplePage() {
	"use cache";
	cacheLife("days");

	const variants = ["primary", "secondary", "outline", "ghost"] as const;
	const sizes = ["sm", "default", "lg"] as const;
	const badgeVariants = [
		"good",
		"warning",
		"critical",
		"info",
		"neutral",
	] as const;

	const demoCode = `function calculateTotal(items) {
  return items.reduce((acc, item) => {
    return acc + item.price;
  }, 0);
}`;

	return (
		<div className="min-h-screen bg-bg-page text-text-primary p-10 space-y-24 font-mono pb-40">
			<header className="space-y-2">
				<h1 className="text-4xl font-bold tracking-tight">
					Biblioteca de componentes UI
				</h1>
				<p className="text-text-secondary">
					Catálogo de componentes padronizados para o DevRoast.
				</p>
			</header>

			{/* Buttons */}
			<section className="space-y-6">
				<h2 className="text-xl border-b border-border-primary pb-2 uppercase tracking-widest opacity-50">
					Buttons
				</h2>
				<div className="overflow-x-auto border border-border-primary bg-bg-surface p-6">
					<table className="w-full text-left">
						<thead>
							<tr className="opacity-50 text-xs uppercase">
								<th className="pb-4 font-normal">Variante / Tamanho</th>
								{sizes.map((s) => (
									<th key={s} className="pb-4 font-normal">
										{s}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-border-primary">
							{variants.map((v) => (
								<tr key={v}>
									<td className="py-4 text-xs capitalize text-text-secondary">
										{v}
									</td>
									{sizes.map((s) => (
										<td key={s} className="py-4">
											<Button variant={v} size={s}>
												$ roast_my_code
											</Button>
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{/* Badges */}
			<section className="space-y-6">
				<h2 className="text-xl border-b border-border-primary pb-2 uppercase tracking-widest opacity-50">
					Badges
				</h2>
				<div className="space-y-8 p-6 border border-border-primary bg-bg-surface">
					<div className="flex flex-wrap gap-8">
						{badgeVariants.map((v) => (
							<div key={v} className="space-y-2">
								<p className="text-[10px] text-text-secondary uppercase">{v}</p>
								<Badge variant={v}>{v}</Badge>
							</div>
						))}
					</div>
					<div className="flex flex-wrap items-center gap-8 border-t border-border-primary pt-6">
						<div className="space-y-2">
							<p className="text-[10px] text-text-secondary uppercase">Small</p>
							<Badge size="sm" variant="good">
								good_status
							</Badge>
						</div>
						<div className="space-y-2">
							<p className="text-[10px] text-text-secondary uppercase">
								Default
							</p>
							<Badge size="default" variant="warning">
								warning_status
							</Badge>
						</div>
						<div className="space-y-2">
							<p className="text-[10px] text-text-secondary uppercase">Large</p>
							<Badge size="lg" variant="critical">
								critical_status
							</Badge>
						</div>
					</div>
				</div>
			</section>

			{/* Selection & Toggles */}
			<section className="space-y-6">
				<h2 className="text-xl border-b border-border-primary pb-2 uppercase tracking-widest opacity-50">
					Selection
				</h2>
				<div className="flex flex-wrap gap-12 p-6 border border-border-primary bg-bg-surface">
					<div className="space-y-4">
						<p className="text-[10px] text-text-secondary uppercase">
							Toggle States
						</p>
						<div className="flex items-center gap-4">
							<ToggleDemo />
						</div>
						<div className="flex items-center gap-4 opacity-50">
							<Toggle disabled id="mode-disabled" />
							<label htmlFor="mode-disabled" className="text-sm">
								disabled mode
							</label>
						</div>
					</div>
				</div>
			</section>

			{/* Cards */}
			<section className="space-y-6">
				<h2 className="text-xl border-b border-border-primary pb-2 uppercase tracking-widest opacity-50">
					Cards
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<Card>
						<Badge variant="critical">critical</Badge>
						<h3 className="text-[13px] font-mono text-text-primary uppercase tracking-tight mt-1">
							using var instead of const/let
						</h3>
						<p className="text-xs text-text-secondary leading-relaxed font-mono opacity-80">
							the var keyword is function-scoped rather than block-scoped, which
							can lead to unexpected behavior and bugs. modern javascript uses
							const for immutable bindings and let for mutable ones.
						</p>
					</Card>
					<Card className="border-accent-green/50 bg-accent-green/5">
						<Badge variant="good">good</Badge>
						<h3 className="text-[13px] font-mono text-accent-green uppercase tracking-tight mt-1">
							Roast Summary
						</h3>
						<p className="text-xs text-text-primary leading-relaxed font-mono opacity-80">
							Este card usa uma variante personalizada via className para
							destacar informações importantes com as cores de destaque do
							sistema.
						</p>
					</Card>
				</div>
			</section>

			{/* Leaderboard Table */}
			<section className="space-y-6">
				<h2 className="text-xl border-b border-border-primary pb-2 uppercase tracking-widest opacity-50">
					Leaderboard Row
				</h2>
				<div className="border border-border-primary bg-bg-surface overflow-hidden">
					<TableRow rank="#1" score="2.1" language="javascript" />
					<TableRow rank="#2" score="1.8" language="typescript" />
					<TableRow rank="#3" score="1.2" language="sql" />
				</div>
			</section>

			{/* Score Rings */}
			<section className="space-y-6">
				<h2 className="text-xl border-b border-border-primary pb-2 uppercase tracking-widest opacity-50">
					Score Rings
				</h2>
				<div className="flex flex-wrap gap-20 p-10 border border-border-primary bg-bg-surface items-center justify-center">
					<div className="space-y-4 text-center">
						<p className="text-xs text-text-tertiary uppercase tracking-widest">
							Low Score (3.5)
						</p>
						<ScoreRing score={3.5} />
					</div>
					<div className="space-y-4 text-center">
						<p className="text-xs text-text-tertiary uppercase tracking-widest">
							High Score (8.0)
						</p>
						<ScoreRing score={8} />
					</div>
				</div>
			</section>

			{/* Code Display */}
			<section className="space-y-6">
				<h2 className="text-xl border-b border-border-primary pb-2 uppercase tracking-widest opacity-50">
					Code Display
				</h2>
				<div className="space-y-12">
					<div className="space-y-4">
						<p className="text-xs text-text-secondary font-sans uppercase tracking-widest">
							Diff Lines
						</p>
						<div className="border border-border-primary overflow-hidden">
							<DiffLine type="removed" code="var total = 0;" />
							<DiffLine type="added" code="const total = 0;" />
							<DiffLine
								type="context"
								code="for (let i = 0; i < items.length; i++) {"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<p className="text-xs text-text-secondary font-sans uppercase tracking-widest">
							Full Code Block (Server Component)
						</p>
						<CodeBlock
							code={demoCode}
							lang="javascript"
							filename="calculate.js"
						/>
					</div>
				</div>
			</section>
		</div>
	);
}
