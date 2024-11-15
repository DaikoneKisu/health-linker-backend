CREATE TABLE IF NOT EXISTS "chat_rooms" (
	"id" serial PRIMARY KEY NOT NULL,
	"room_name" varchar(100) NOT NULL,
	"owner_document" varchar(10) NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_owner_document_users_document_fk" FOREIGN KEY ("owner_document") REFERENCES "public"."users"("document") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
