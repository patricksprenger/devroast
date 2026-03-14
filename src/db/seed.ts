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

	const codeSnippets: Record<string, string[]> = {
		javascript: [
			"function calculateTotal(items) {\n  var total = 0;\n  for (var i = 0; i < items.length; i++) {\n    total = total + items[i].price;\n  }\n  return total;\n}",
			"const user = { name: 'John', age: 30 };\nconsole.log(user.name);",
			"if (x == true) { return true; } else { return false; }",
			"eval(atob('ZmV0Y2goJ2h0dHA6Ly9tYWxpY2lvdXMuc2l0ZScp'));",
		],
		typescript: [
			"interface User {\n  id: string;\n  name: string;\n}\n\nfunction getUser(id: any): User {\n  return { id, name: 'Unknown' } as any;\n}",
			"type Status = 'open' | 'closed';\nlet current: Status = 'open';",
		],
		python: [
			"def sum_list(items):\n    result = 0\n    for item in items:\n        result += item\n    return result",
			"import os\nos.system('rm -rf /')",
		],
		rust: [
			'fn main() {\n    let mut x = 5;\n    println!("The value of x is: {}", x);\n}',
			"pub fn add(a: i32, b: i32) -> i32 {\n    a + b\n}",
		],
		go: [
			'func main() {\n\tfmt.Println("Hello, World")\n}',
			"if err != nil {\n\treturn err\n}",
		],
		cpp: [
			'#include <iostream>\nint main() {\n    std::cout << "Hello World";\n    return 0;\n}',
		],
		html: [
			'<div class="container">\n  <h1>Title</h1>\n  <p>Content</p>\n</div>',
		],
		css: [".btn {\n  background: red;\n  color: white;\n  padding: 10px;\n}"],
		other: ["SELECT * FROM users WHERE 1=1;"],
	};

	for (let i = 0; i < 100; i++) {
		const language = faker.helpers.arrayElement(languages);
		const snippet = faker.helpers.arrayElement(
			codeSnippets[language] || codeSnippets.other,
		);

		const [roast] = await db
			.insert(roasts)
			.values({
				code: snippet,
				language: language,
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
				roastQuote: snippet.split("\n")[0], // Use first line as quote/preview
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
			improvedCode: faker.datatype.boolean(0.5)
				? "function improved() {\n  // fixes the issue\n}"
				: null,
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
