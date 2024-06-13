DO $$ BEGIN
 CREATE TYPE "public"."user_type_enum" AS ENUM('specialist', 'rural professional');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"document" varchar(10) PRIMARY KEY NOT NULL,
	"email" varchar(254) NOT NULL,
	"full_name" varchar(100) NOT NULL,
	"password" varchar(32) NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"user_type" "user_type_enum" NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
