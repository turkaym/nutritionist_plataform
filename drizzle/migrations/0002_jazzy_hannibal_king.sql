ALTER TABLE "sessions" RENAME COLUMN "session_token" TO "session_token_hash";--> statement-breakpoint
DROP INDEX "sessions_token_unique_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_token_hash_unique_idx" ON "sessions" USING btree ("session_token_hash");