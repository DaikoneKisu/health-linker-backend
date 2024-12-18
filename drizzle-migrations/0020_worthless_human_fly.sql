CREATE TABLE IF NOT EXISTS "frequently-asked-questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" varchar NOT NULL,
	"answer" varchar NOT NULL
);
