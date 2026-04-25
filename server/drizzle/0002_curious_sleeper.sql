ALTER TABLE "article" ADD COLUMN "author" text;--> statement-breakpoint
ALTER TABLE "article" ADD COLUMN "words_count" integer;--> statement-breakpoint
ALTER TABLE "article" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "feed" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "feed" ADD COLUMN "icon_url" text;--> statement-breakpoint
ALTER TABLE "feed" ADD COLUMN "language" varchar(5);