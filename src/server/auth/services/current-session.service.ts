import { AppError } from "@/server/shared/errors/app-error";
import { AUTH_ERROR_CODES } from "@/server/auth/contracts/auth-errors";
import type { CurrentSessionResult } from "@/server/auth/contracts/auth-session";
import { createRolesRepository } from "@/server/auth/repositories/roles.repository";
import { createSessionsRepository } from "@/server/auth/repositories/sessions.repository";
import { createUsersRepository } from "@/server/auth/repositories/users.repository";
import { hashSessionToken } from "@/server/auth/utils/session-token";

const usersRepository = createUsersRepository();
const rolesRepository = createRolesRepository();
const sessionsRepository = createSessionsRepository();

export async function resolveCurrentSession(
    sessionToken: string | null | undefined,
): Promise<CurrentSessionResult> {
    if (!sessionToken) {
        throw new AppError({
            code: AUTH_ERROR_CODES.UNAUTHENTICATED,
            message: "Authentication is required.",
        });
    }

    const sessionTokenHash = hashSessionToken(sessionToken);

    const session = await sessionsRepository.findByTokenHash(sessionTokenHash);

    if (!session) {
        throw new AppError({
            code: AUTH_ERROR_CODES.SESSION_NOT_FOUND,
            message: "Session was not found.",
        });
    }

    if (session.revoked_at) {
        throw new AppError({
            code: AUTH_ERROR_CODES.SESSION_REVOKED,
            message: "Session has been revoked.",
        });
    }

    const now = new Date();

    if (session.expires_at <= now) {
        throw new AppError({
            code: AUTH_ERROR_CODES.SESSION_EXPIRED,
            message: "Session has expired.",
        });
    }

    const user = await usersRepository.findById(session.user_id);

    if (!user) {
        throw new AppError({
            code: AUTH_ERROR_CODES.USER_NOT_FOUND,
            message: "User was not found.",
        });
    }

    if (user.status === "inactive") {
        throw new AppError({
            code: AUTH_ERROR_CODES.USER_INACTIVE,
            message: "User account is inactive.",
        });
    }

    if (user.status === "suspended") {
        throw new AppError({
            code: AUTH_ERROR_CODES.USER_SUSPENDED,
            message: "User account is suspended.",
        });
    }

    const role = await rolesRepository.findById(user.role_id);

    if (!role) {
        throw new AppError({
            code: AUTH_ERROR_CODES.UNAUTHORIZED,
            message: "User role could not be resolved.",
        });
    }

    return {
        session: {
            id: session.id,
            userId: session.user_id,
            expiresAt: session.expires_at,
        },
        user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: {
                id: role.id,
                code: role.code,
                name: role.name,
            },
        },
    };
}