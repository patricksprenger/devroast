import { faker } from "@faker-js/faker";
import { db } from "./index";
import { analysisItems, roasts } from "./schema";

async function seed() {
	console.log("🌱 Seeding database...");

	// Clear existing data
	await db.delete(analysisItems);
	await db.delete(roasts);

	const languages = [
		"javascript",
		"typescript",
		"python",
		"rust",
		"go",
		"cpp",
		"html",
		"css",
		"other",
	] as const;
	const severities = ["critical", "warning", "good", "info"] as const;
	const modes = ["technical", "sarcasm"] as const;

	for (let i = 0; i < 100; i++) {
		const [roast] = await db
			.insert(roasts)
			.values({
				code: faker.lorem.paragraphs(2),
				language: faker.helpers.arrayElement(languages),
				score: faker.number
					.float({ min: 0, max: 10, fractionDigits: 1 })
					.toString(),
				verdict: faker.helpers.arrayElement([
					"Absolute Garbage",
					"Mediocre at best",
					"Actually decent",
					"Senior Level",
					"Junior Mistake",
				]),
				roastQuote: faker.lorem.sentence(),
				mode: faker.helpers.arrayElement(modes),
				isPrivate: faker.datatype.boolean(0.1), // 10% chance of being private
				authorUsername: faker.internet.username(),
				authorAvatarUrl: faker.image.avatar(),
			})
			.returning();

		const itemsCount = faker.number.int({ min: 1, max: 5 });

		const items = Array.from({ length: itemsCount }).map(() => ({
			roastId: roast.id,
			title: faker.lorem.words(3),
			description: faker.lorem.sentence(),
			severity: faker.helpers.arrayElement(severities),
			lineNumber: faker.number.int({ min: 1, max: 50 }),
			improvedCode: faker.datatype.boolean(0.5) ? faker.lorem.lines(3) : null,
		}));

		await db.insert(analysisItems).values(items);
	}

	console.log("✅ Seed completed successfully!");
	process.exit(0);
}

seed().catch((err) => {
	console.error("❌ Seed failed:");
	console.error(err);
	process.exit(1);
});
