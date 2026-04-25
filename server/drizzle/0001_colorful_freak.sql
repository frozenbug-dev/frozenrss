ALTER TABLE "feed" ADD COLUMN "title" text DEFAULT 'unknown' NOT NULL;--> statement-breakpoint
ALTER TABLE "feed" ADD COLUMN "error" text;