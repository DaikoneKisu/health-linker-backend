CREATE TABLE IF NOT EXISTS "specialists" (
	"document" varchar(10) PRIMARY KEY NOT NULL,
	"specialty_id" integer NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "specialists" ADD CONSTRAINT "specialists_document_users_document_fk" FOREIGN KEY ("document") REFERENCES "public"."users"("document") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "specialists" ADD CONSTRAINT "specialists_specialty_id_specialties_id_fk" FOREIGN KEY ("specialty_id") REFERENCES "public"."specialties"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
