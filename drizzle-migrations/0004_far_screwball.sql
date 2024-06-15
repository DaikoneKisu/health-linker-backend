CREATE TABLE IF NOT EXISTS "rural_professionals" (
	"document" varchar(10) PRIMARY KEY NOT NULL,
	"zone" varchar(256) NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rural_professionals" ADD CONSTRAINT "rural_professionals_document_users_document_fk" FOREIGN KEY ("document") REFERENCES "public"."users"("document") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
