import { and, eq, gt, isNull } from "drizzle-orm";

import { sessions } from "@/../drizzle/schema";
import { database } from "@/server/shared/db/database";
import type { DatabaseExecutor } from "@/server/shared/db/types";
import type {
    CreateSessionInput,
    RevokeSessionInput,
} from "@/server/auth/types/auth.types";

const sessionSelect = {
    id: sessions.id,
    user_id: sessions.user_id,
    session_token: sessions.session_token,
    ip_address: sessions.ip_address,
    user_agent: sessions.user_agent,
    expires_at: sessions.expires_at,
    revoked_at: sessions.revoked_at,
    last_seen_at: sessions.last_seen_at,
    created_at: sessions.created_at,
    updated_at: sessions.updated_at,
};

export function createSessionsRepository(
    executor: DatabaseExecutor = database,
) {
    return {
        async createSession(input: CreateSessionInput) {
            const [session] = await executor
                .insert(sessions)
                .values({
                    user_id: input.userId,
                    session_token: input.sessionToken,
                    expires_at: input.expiresAt,
                    ip_address: input.ipAddress ?? null,
                    user_agent: input.userAgent ?? null,
                })
                .returning(sessionSelect);

            return session;
        },

        async findActiveByToken(token: string) {
            const now = new Date();

            const [session] = await executor
                .select(sessionSelect)
                .from(sessions)
                .where(
                    and(
                        eq(sessions.session_token, token),
                        isNull(sessions.revoked_at),
                        gt(sessions.expires_at, now),
                    ),
                )
                .limit(1);

            return session ?? null;
        },

        async findById(sessionId: string) {
            const [session] = await executor
                .select(sessionSelect)
                .from(sessions)
                .where(eq(sessions.id, sessionId))
                .limit(1);

            return session ?? null;
        },

        async revokeSession(input: RevokeSessionInput) {
            const [session] = await executor
                .update(sessions)
                .set({
                    revoked_at: input.revokedAt,
                    updated_at: input.revokedAt,
                })
                .where(eq(sessions.id, input.sessionId))
                .returning(sessionSelect);

            return session ?? null;
        },
    };
}