import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { asc, sql } from "drizzle-orm";
import { z } from "zod";
import { analysisItems, roasts } from "@/db/schema";
import { createTRPCRouter, publicProcedure } from "./trpc";

export const roastSchema = z.object({
    score: z.number()
        .min(0)
        .max(10)
        .describe("A nota final do código de 0 a 10. Pode ter casas decimais."),
    verdict: z.string()
        .max(300)
        .describe("Um comentário extremamente curto (máximo de 5 a 6 palavras) sobre o código. Ex: 'Precisa de ajuda séria', 'Código impecável'."),
    roastQuote: z.string()
        .describe("Uma frase sarcástica e ácida humilhando amigavelmente as escolhas do desenvolvedor."),
    improvedCode: z.string()
        .describe("O código inteiro refatorado e aplicando as melhores práticas."),

    // Aqui está a mágica para a tabela analysisItems:
    issues: z.array(
        z.object({
            lineNumber: z.number()
                .describe("O número da linha onde o problema foi encontrado."),
            title: z.string()
                .describe("Um título curto e técnico para o erro (ex: 'Global Variable Pollution')."),
            description: z.string()
                .describe("A explicação detalhada do porquê isso é um erro e como afeta o código."),
            severity: z.enum(["info", "warning", "critical", "good"])
                .describe("O nível de gravidade do erro. Escolha estritamente entre info, warning, critical ou good."),
            improvedCode: z.string()
                .describe("Um pequeno trecho de código mostrando apenas como corrigir esta linha específica.")
        })
    ).describe("Uma lista detalhada de todos os problemas encontrados no código.")
});

const sarcasmPrompt = `You are a toxic, extremely sarcastic senior developer. Roast this code brutally. 
Be funny but technically accurate.
Your response MUST be a valid JSON object adhering to the 'roastSchema' structure.
You must provide a global score from 0 to 10. Use the full scale (e.g., clean code should get 9s and 10s even if you roast the author's personality, while 0 is for absolute garbage).
Provide a VERY SHORT verdict (maximum 6 words), a roasting quote, a full improved version of the code, and a list of specific issues with line numbers and line-specific improvements.`;

const technicalPrompt = `You are a professional software architect. Review this code for best practices, performance, and security.
Your response MUST be a valid JSON object adhering to the 'roastSchema' structure.
Provide a global score from 0 to 10. Be fair and use the full scale: award 9s and 10s for clean, well-structured code. 
Provide a VERY SHORT professional verdict (maximum 6 words), a constructive summary quote, a full improved version of the code, 
and a list of specific issues with line numbers and line-specific improvements.`;

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
            const { object } = await generateObject({
                model: google("gemini-2.5-flash"),
                system: input.mode === "sarcasm" ? sarcasmPrompt : technicalPrompt,
                prompt: `Roast this ${input.language} code:\n\n${input.code}`,
                schema: roastSchema,
            });

            console.log("AI Output Object:", object);

            return await ctx.db.transaction(async (tx) => {
                const [roast] = await tx
                    .insert(roasts)
                    .values({
                        code: input.code,
                        language: input.language as any,
                        mode: input.mode,
                        score: String(object.score.toFixed(1)),
                        verdict: object.verdict,
                        roastQuote: object.roastQuote,
                        improvedCode:
                            object.improvedCode
                                ?.replace(/^```[a-z-]*\n/gi, "")
                                .replace(/\n```$/g, "") ?? "",
                    })
                    .returning();

                if (object.issues && object.issues.length > 0) {
                    await tx.insert(analysisItems).values(
                        object.issues.map((issue) => ({
                            roastId: roast.id,
                            title: issue.title ?? "",
                            description: issue.description ?? "",
                            severity: issue.severity ?? "low",
                            lineNumber: issue.lineNumber,
                            improvedCode: issue.improvedCode ?? "",
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
