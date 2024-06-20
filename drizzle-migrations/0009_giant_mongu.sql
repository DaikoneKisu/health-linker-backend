CREATE TABLE IF NOT EXISTS "specialists_mentor_clinical_cases" (
	"clinical_case_id" integer NOT NULL,
	"specialist_document" varchar NOT NULL,
	CONSTRAINT "specialists_mentor_clinical_cases_clinical_case_id_specialist_document_pk" PRIMARY KEY("clinical_case_id","specialist_document")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "specialists_mentor_clinical_cases" ADD CONSTRAINT "specialists_mentor_clinical_cases_clinical_case_id_clinical_cases_id_fk" FOREIGN KEY ("clinical_case_id") REFERENCES "public"."clinical_cases"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "specialists_mentor_clinical_cases" ADD CONSTRAINT "specialists_mentor_clinical_cases_specialist_document_specialists_document_fk" FOREIGN KEY ("specialist_document") REFERENCES "public"."specialists"("document") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
