import { createSessionsRepository } from "@/server/auth/repositories/sessions.repository";
import { buildExpiredSessionCookieOptions } from "@/server/auth/utils/session-cookie";
import { hashSessionToken } from "@/server/auth/utils/session-token";

const sessionsRepository = createSessionsRepository();

export type LogoutResult = {
    cookie: ReturnType<typeof buildExpiredSessionCookieOptions>;
};

export async function logoutUser(
    sessionToken: string | null | undefined,
): Promise<LogoutResult> {
    if (!sessionToken) {
        return {
            cookie: buildExpiredSessionCookieOptions(),
        };
    }

    const sessionTokenHash = hashSessionToken(sessionToken);

    const session = await sessionsRepository.findByTokenHash(sessionTokenHash);

    if (!session) {
        return {
            cookie: buildExpiredSessionCookieOptions(),
        };
    }

    if (!session.revoked_at) {
        await sessionsRepository.revokeSession({
            sessionId: session.id,
            revokedAt: new Date(),
        });
    }

    return {
        cookie: buildExpiredSessionCookieOptions(),
    };
}