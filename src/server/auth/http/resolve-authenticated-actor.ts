import type { NextRequest } from "next/server";

import { AUTH_COOKIE_NAME } from "@/server/auth/constants/auth.constants";
import { AUTH_ERROR_CODES } from "@/server/auth/contracts/auth-errors";
import type { AuthenticatedActor } from "@/server/auth/contracts/authenticated-actor";
import { resolveCurrentSession } from "@/server/auth/services/current-session.service";
import { AppError } from "@/server/shared/errors/app-error";

export async function resolveAuthenticatedActor(
    request: NextRequest,
): Promise<AuthenticatedActor> {
    const sessionToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!sessionToken) {
        throw new AppError({
            code: AUTH_ERROR_CODES.UNAUTHENTICATED,
            message: "Authentication is required.",
        });
    }

    const currentSession = await resolveCurrentSession(sessionToken);

    return {
        sessionId: currentSession.session.id,
        sessionUserId: currentSession.session.userId,
        sessionExpiresAt: currentSession.session.expiresAt,
        user: currentSession.user,
    };
}