import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { asc, sql } from "drizzle-orm";
import { z } from "zod";
import { analysisItems, roasts } from "@/db/schema";
import { createTRPCRouter, publicProcedure } from "./trpc";

const roastSchema = z.object({
	score: z.number().min(0).max(10),
	verdict: z.string().max(100),
	roastQuote: z.string(),
	improvedCode: z.string(),
	issues: z.array(
		z.object({
			title: z.string(),
			description: z.string(),
			severity: z.enum(["critical", "warning", "good", "info"]),
			lineNumber: z.number().optional(),
			improvedCode: z.string().optional(),
		}),
	),
});

const sarcasmPrompt = `You are a toxic, extremely sarcastic senior developer. Roast this code brutally. 
Be funny but technically accurate.
You must provide a global score from 0 to 10 (where 0 is absolute garbage), a short verdict, a roasting quote, 
a full improved version of the code, and a list of specific issues with line numbers and line-specific improvements.`;

const technicalPrompt = `You are a professional software architect. Review this code for best practices, performance, and security.
Provide a global score from 0 to 10, a short professional verdict, a constructive summary quote, 
a full improved version of the code, and a list of specific issues with line numbers and line-specific improvements.`;

export const appRouter = createTRPCRouter({
	createRoast: publicProcedure
		.input(
			z.object({
				code: z.string().max(10000),
				language: z.string(),
				mode: z.enum(["technical", "sarcasm"]),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { output } = await generateText({
				model: google("gemini-1.5-flash"),
				system: input.mode === "sarcasm" ? sarcasmPrompt : technicalPrompt,
				prompt: `Roast this ${input.language} code:\n\n${input.code}`,
				output: Output.object({ schema: roastSchema }),
			});

			return await ctx.db.transaction(async (tx) => {
				const [roast] = await tx
					.insert(roasts)
					.values({
						code: input.code,
						language: input.language as any,
						mode: input.mode,
						score: output.score.toFixed(1),
						verdict: output.verdict,
						roastQuote: output.roastQuote,
						improvedCode: output.improvedCode,
					})
					.returning();

				if (output.issues.length > 0) {
					await tx.insert(analysisItems).values(
						output.issues.map((issue) => ({
							roastId: roast.id,
							title: issue.title,
							description: issue.description,
							severity: issue.severity,
							lineNumber: issue.lineNumber,
							improvedCode: issue.improvedCode,
						})),
					);
				}
				return roast;
			});
		}),

	getMetrics: publicProcedure.query(async ({ ctx }) => {
		const [result] = await ctx.db
			.select({
				totalRoasts: sql<number>`count(${roasts.id})::int`,
				avgScore: sql<number>`avg(${roasts.score})::float`,
			})
			.from(roasts)
			.where(sql`${roasts.isPrivate} = false`);

		return {
			totalRoasts: result?.totalRoasts ?? 0,
			avgScore: result?.avgScore ?? 0,
		};
	}),

	getLeaderboard: publicProcedure
		.input(z.object({ limit: z.number().min(1).max(100).default(3) }))
		.query(async ({ ctx, input }) => {
			const [items, [countResult]] = await Promise.all([
				ctx.db
					.select()
					.from(roasts)
					.where(sql`${roasts.isPrivate} = false`)
					.orderBy(asc(roasts.score))
					.limit(input.limit),
				ctx.db
					.select({ count: sql<number>`count(*)::int` })
					.from(roasts)
					.where(sql`${roasts.isPrivate} = false`),
			]);

			return {
				items,
				totalCount: countResult?.count ?? 0,
			};
		}),
});

export type AppRouter = typeof appRouter;
