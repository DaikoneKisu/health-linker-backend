CREATE TABLE IF NOT EXISTS "clinical_case_feedback" (
	"id" integer NOT NULL,
	"clinical_case_id" integer NOT NULL,
	"user_document" varchar(10) NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clinical_case_feedback_id_clinical_case_id_user_document_pk" PRIMARY KEY("id","clinical_case_id","user_document")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical_case_feedback" ADD CONSTRAINT "clinical_case_feedback_clinical_case_id_clinical_cases_id_fk" FOREIGN KEY ("clinical_case_id") REFERENCES "public"."clinical_cases"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical_case_feedback" ADD CONSTRAINT "clinical_case_feedback_user_document_users_document_fk" FOREIGN KEY ("user_document") REFERENCES "public"."users"("document") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
