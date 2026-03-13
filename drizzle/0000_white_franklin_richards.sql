CREATE TYPE "public"."language_enum" AS ENUM('javascript', 'typescript', 'python', 'rust', 'go', 'cpp', 'html', 'css', 'other');--> statement-breakpoint
CREATE TYPE "public"."roast_mode_enum" AS ENUM('technical', 'sarcasm');--> statement-breakpoint
CREATE TYPE "public"."severity_enum" AS ENUM('critical', 'warning', 'good', 'info');--> statement-breakpoint
CREATE TABLE "analysis_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"roast_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"severity" "severity_enum" NOT NULL,
	"line_number" integer,
	"improved_code" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roasts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"language" "language_enum" NOT NULL,
	"score" numeric(3, 1) NOT NULL,
	"verdict" varchar(100) NOT NULL,
	"roast_quote" text NOT NULL,
	"mode" "roast_mode_enum" DEFAULT 'sarcasm' NOT NULL,
	"is_private" boolean DEFAULT false NOT NULL,
	"author_username" varchar(50),
	"author_avatar_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "analysis_items" ADD CONSTRAINT "analysis_items_roast_id_roasts_id_fk" FOREIGN KEY ("roast_id") REFERENCES "public"."roasts"("id") ON DELETE cascade ON UPDATE no action;