import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { z } from "zod";

const ogSchema = z.object({
	score: z.string(),
	verdict: z.string(),
	quote: z.string(),
	lang: z.string(),
	lines: z.string().transform(Number),
});

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const parsed = ogSchema.safeParse(Object.fromEntries(searchParams.entries()));

	if (!parsed.success) {
		return new Response("Invalid params", { status: 400 });
	}

	const { score, verdict, quote, lang, lines } = parsed.data;

	const fontData = await readFile(
		join(process.cwd(), "public/fonts/JetBrainsMono-Bold.ttf"),
	);

	return new ImageResponse(
		<div
			style={{
				height: "100%",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#0A0A0A",
				border: "1px solid #2A2A2A",
				fontFamily: "JetBrainsMono",
				padding: "40px",
			}}
		>
			{/* Branding */}
			<div
				style={{
					position: "absolute",
					top: "40px",
					display: "flex",
					fontSize: "24px",
					color: "#6B7280",
				}}
			>
				{"> devroast"}
			</div>

			{/* Main Content */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: "32px",
				}}
			>
				{/* Score */}
				<div style={{ display: "flex", alignItems: "baseline" }}>
					<span
						style={{
							fontSize: "120px",
							fontWeight: 700,
							color: "#F59E0B",
							lineHeight: 1,
						}}
					>
						{score}
					</span>
					<span
						style={{ fontSize: "48px", color: "#4B5563", marginLeft: "8px" }}
					>
						/10
					</span>
				</div>

				{/* Verdict Badge */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						backgroundColor: "rgba(239, 68, 68, 0.1)",
						border: "1px solid rgba(239, 68, 68, 0.2)",
						padding: "8px 16px",
						borderRadius: "4px",
						gap: "8px",
					}}
				>
					<div
						style={{
							width: "8px",
							height: "8px",
							borderRadius: "50%",
							backgroundColor: "#EF4444",
						}}
					/>
					<span
						style={{
							fontSize: "20px",
							color: "#EF4444",
							textTransform: "lowercase",
						}}
					>
						{verdict}
					</span>
				</div>

				{/* Roast Quote */}
				<div
					style={{
						fontSize: "32px",
						color: "#FAFAFA",
						fontStyle: "italic",
						textAlign: "center",
						maxWidth: "800px",
						lineHeight: 1.4,
					}}
				>
					"{quote}"
				</div>
			</div>

			{/* Meta Info */}
			<div
				style={{
					position: "absolute",
					bottom: "40px",
					fontSize: "20px",
					color: "#6B7280",
				}}
			>
				lang: {lang} · {lines} lines
			</div>
		</div>,
		{
			width: 1200,
			height: 630,
			fonts: [
				{
					name: "JetBrainsMono",
					data: fontData,
					style: "normal",
					weight: 700,
				},
			],
		},
	);
}
