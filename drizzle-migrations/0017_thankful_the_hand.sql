CREATE TABLE IF NOT EXISTS "educational_resources" (
	"id" serial PRIMARY KEY NOT NULL,
	"author_email" varchar,
	"author_document" varchar,
	"title" varchar NOT NULL,
	"content" varchar NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "educational_resources" ADD CONSTRAINT "educational_resources_author_email_admins_email_fk" FOREIGN KEY ("author_email") REFERENCES "public"."admins"("email") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "educational_resources" ADD CONSTRAINT "educational_resources_author_document_specialists_document_fk" FOREIGN KEY ("author_document") REFERENCES "public"."specialists"("document") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
