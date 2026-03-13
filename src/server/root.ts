import { sql } from "drizzle-orm";
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
});

export type AppRouter = typeof appRouter;
