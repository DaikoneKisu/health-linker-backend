ALTER TABLE "rural_professionals" DROP CONSTRAINT "rural_professionals_document_users_document_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rural_professionals" ADD CONSTRAINT "rural_professionals_document_users_document_fk" FOREIGN KEY ("document") REFERENCES "public"."users"("document") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
