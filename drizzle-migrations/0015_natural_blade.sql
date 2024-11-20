ALTER TABLE "clinical_cases" ADD COLUMN "errased_at" timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "clinical_cases" DROP COLUMN IF EXISTS "fecha_borrado";