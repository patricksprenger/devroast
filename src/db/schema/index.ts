import { relations } from "drizzle-orm";
import {
	boolean,
	decimal,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const languageEnum = pgEnum("language_enum", [
	"javascript",
	"typescript",
	"python",
	"rust",
	"go",
	"cpp",
	"html",
	"css",
	"other",
]);

export const severityEnum = pgEnum("severity_enum", [
	"critical",
	"warning",
	"good",
	"info",
]);

export const roastModeEnum = pgEnum("roast_mode_enum", [
	"technical",
	"sarcasm",
]);

export const roasts = pgTable("roasts", {
	id: uuid("id").primaryKey().defaultRandom(),
	code: text("code").notNull(),
	language: languageEnum("language").notNull(),
	score: decimal("score", { precision: 3, scale: 1 }).notNull(),
	verdict: varchar("verdict", { length: 100 }).notNull(),
	roastQuote: text("roast_quote").notNull(),
	mode: roastModeEnum("mode").default("sarcasm").notNull(),
	isPrivate: boolean("is_private").default(false).notNull(),
	authorUsername: varchar("author_username", { length: 50 }),
	authorAvatarUrl: text("author_avatar_url"),
	improvedCode: text("improved_code"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analysisItems = pgTable("analysis_items", {
	id: uuid("id").primaryKey().defaultRandom(),
	roastId: uuid("roast_id")
		.references(() => roasts.id, { onDelete: "cascade" })
		.notNull(),
	title: varchar("title", { length: 255 }).notNull(),
	description: text("description").notNull(),
	severity: severityEnum("severity").notNull(),
	lineNumber: integer("line_number"),
	improvedCode: text("improved_code"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const roastsRelations = relations(roasts, ({ many }) => ({
	analysisItems: many(analysisItems),
}));

export const analysisItemsRelations = relations(analysisItems, ({ one }) => ({
	roast: one(roasts, {
		fields: [analysisItems.roastId],
		references: [roasts.id],
	}),
}));
