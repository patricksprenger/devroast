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

	const fontData = await readFile(
		join(process.cwd(), "public/fonts/JetBrainsMono-Bold.ttf"),
	);

	const fonts = [
		{
			name: "JetBrainsMono",
			data: fontData,
			style: "normal" as const,
			weight: 700 as const,
		},
	];

	if (!parsed.success) {
		return new ImageResponse(
			<div
				tw="flex flex-col items-center justify-center w-full h-full bg-[#0A0A0A] text-[#6B7280]"
				style={{ fontFamily: "JetBrainsMono" }}
			>
				{/* Branding */}
				<div tw="absolute top-10 left-0 right-0 flex justify-center">
					<div tw="flex text-2xl font-bold">
						<span tw="text-[#10B981] mr-2">{">"}</span>
						<span tw="text-[#FAFAFA]">devroast</span>
					</div>
				</div>

				<div tw="text-4xl font-bold mb-4 text-[#FAFAFA]">
					400 - Invalid Parameters
				</div>
				<div tw="text-xl">The roast data could not be parsed.</div>
			</div>,
			{ width: 1200, height: 630, fonts },
		);
	}

	const { score, verdict, quote, lang, lines } = parsed.data;

	return new ImageResponse(
		<div
			tw="flex flex-col items-center justify-center w-full h-full bg-[#0A0A0A] border-[1px] border-[#2A2A2A] p-10"
			style={{ fontFamily: "JetBrainsMono" }}
		>
			{/* Branding */}
			<div tw="absolute top-10 left-0 right-0 flex justify-center">
				<div tw="flex text-2xl font-bold">
					<span tw="text-[#10B981] mr-2">{">"}</span>
					<span tw="text-[#FAFAFA]">devroast</span>
				</div>
			</div>

			{/* Main Content */}
			<div tw="flex flex-col items-center">
				{/* Score */}
				<div tw="flex items-baseline mb-8">
					<span tw="text-[120px] font-bold text-[#F59E0B] leading-none">
						{score}
					</span>
					<span tw="text-[48px] text-[#4B5563] ml-2">/10</span>
				</div>

				{/* Verdict Badge */}
				<div tw="flex items-center bg-[#EF4444]/10 border border-[#EF4444]/20 px-4 py-2 rounded-none mb-8">
					<div tw="w-2 h-2 rounded-full bg-[#EF4444] mr-2" />
					<span tw="text-[20px] text-[#EF4444] lowercase">{verdict}</span>
				</div>

				{/* Roast Quote */}
				<div tw="text-[32px] text-[#FAFAFA] text-center italic max-w-[800px] leading-relaxed">
					{`"${quote}"`}
				</div>
			</div>

			{/* Meta Info */}
			<div tw="absolute bottom-10 flex text-[20px] text-[#6B7280]">
				{`lang: ${lang} · ${lines} lines`}
			</div>
		</div>,
		{
			width: 1200,
			height: 630,
			fonts,
		},
	);
}
