CREATE TABLE IF NOT EXISTS "clinical_cases_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"link" text NOT NULL,
	"clinical_case_id" integer NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical_cases_files" ADD CONSTRAINT "clinical_cases_files_clinical_case_id_clinical_cases_id_fk" FOREIGN KEY ("clinical_case_id") REFERENCES "public"."clinical_cases"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
