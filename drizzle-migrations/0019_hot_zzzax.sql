DROP TABLE "chat_rooms" CASCADE;--> statement-breakpoint
ALTER TABLE "chat_message" DROP CONSTRAINT IF EXISTS "chat_message_room_id_chat_rooms_id_fk";
--> statement-breakpoint
ALTER TABLE "chat_message" ADD COLUMN "case_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_case_id_clinical_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."clinical_cases"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "chat_message" DROP COLUMN IF EXISTS "room_id";