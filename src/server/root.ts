import { asc, sql } from "drizzle-orm";
import { z } from "zod";
import { roasts } from "@/db/schema";
import { createTRPCRouter, publicProcedure } from "./trpc";

export const appRouter = createTRPCRouter({
	getMetrics: publicProcedure.query(async ({ ctx }) => {
		const [result] = await ctx.db
			.select({
				totalRoasts: sql<number>`count(${roasts.id})::int`,
				avgScore: sql<number>`avg(${roasts.score})::float`,
			})
			.from(roasts);

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
