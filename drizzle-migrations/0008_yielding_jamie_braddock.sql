DO $$ BEGIN
 CREATE TYPE "public"."gender_enum" AS ENUM('masculine', 'feminine');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clinical_cases" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"reason" text NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"is_closed" boolean DEFAULT false NOT NULL,
	"patient_birthdate" timestamp NOT NULL,
	"patient_gender" "gender_enum" NOT NULL,
	"patient_reason" text NOT NULL,
	"patient_assessment" text NOT NULL,
	"required_specialty_id" integer NOT NULL,
	"rural_professional_document" varchar(10) NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical_cases" ADD CONSTRAINT "clinical_cases_required_specialty_id_specialties_id_fk" FOREIGN KEY ("required_specialty_id") REFERENCES "public"."specialties"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical_cases" ADD CONSTRAINT "clinical_cases_rural_professional_document_rural_professionals_document_fk" FOREIGN KEY ("rural_professional_document") REFERENCES "public"."rural_professionals"("document") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
