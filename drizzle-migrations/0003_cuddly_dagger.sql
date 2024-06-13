CREATE TABLE IF NOT EXISTS "admins" (
	"email" varchar(254) PRIMARY KEY NOT NULL,
	"full_name" varchar(100) NOT NULL,
	"password" varchar(60) NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
