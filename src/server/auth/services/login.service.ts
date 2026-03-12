import { AppError } from "@/server/shared/errors/app-error";
import { APP_ERROR_CODES } from "@/server/shared/errors/error-codes";
import { AUTH_ERROR_CODES } from "@/server/auth/contracts/auth-errors";
import type { LoginInput } from "@/server/auth/contracts/auth-credentials";
import type { LoginResult } from "@/server/auth/contracts/auth-session";
import { createRolesRepository } from "@/server/auth/repositories/roles.repository";
import { createSessionsRepository } from "@/server/auth/repositories/sessions.repository";
import { createUsersRepository } from "@/server/auth/repositories/users.repository";
import { buildSessionCookieOptions } from "@/server/auth/utils/session-cookie";
import {
    calculateSessionExpiresAt,
    generateSessionToken,
    hashSessionToken,
} from "@/server/auth/utils/session-token";
import { verifyPassword } from "@/server/auth/utils/password";
import { database } from "@/server/shared/db/database";

const usersRepository = createUsersRepository();
const rolesRepository = createRolesRepository();

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

function validateLoginInput(input: LoginInput): void {
    const email = input.credentials.email.trim();
    const password = input.credentials.password;

    if (!email) {
        throw new AppError({
            code: APP_ERROR_CODES.VALIDATION_ERROR,
            message: "Email is required.",
        });
    }

    if (!password) {
        throw new AppError({
            code: APP_ERROR_CODES.VALIDATION_ERROR,
            message: "Password is required.",
        });
    }
}

export async function loginUser(input: LoginInput): Promise<LoginResult> {
    validateLoginInput(input);

    const normalizedEmail = normalizeEmail(input.credentials.email);

    const user = await usersRepository.findByEmail(normalizedEmail);

    if (!user || !user.password_hash) {
        throw new AppError({
            code: AUTH_ERROR_CODES.INVALID_CREDENTIALS,
            message: "Invalid email or password.",
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

    const isPasswordValid = await verifyPassword(
        input.credentials.password,
        user.password_hash,
    );

    if (!isPasswordValid) {
        throw new AppError({
            code: AUTH_ERROR_CODES.INVALID_CREDENTIALS,
            message: "Invalid email or password.",
        });
    }

    const role = await rolesRepository.findById(user.role_id);

    if (!role) {
        throw new AppError({
            code: AUTH_ERROR_CODES.UNAUTHORIZED,
            message: "User role could not be resolved.",
        });
    }

    const sessionToken = generateSessionToken();
    const sessionTokenHash = hashSessionToken(sessionToken);
    const sessionExpiresAt = calculateSessionExpiresAt();
    const loginTimestamp = new Date();

    const session = await database.transaction(async (tx) => {
        const transactionalUsersRepository = createUsersRepository(tx);
        const transactionalSessionsRepository = createSessionsRepository(tx);

        const createdSession = await transactionalSessionsRepository.createSession({
            userId: user.id,
            sessionTokenHash,
            expiresAt: sessionExpiresAt,
            ipAddress: input.context?.ipAddress ?? null,
            userAgent: input.context?.userAgent ?? null,
        });

        await transactionalUsersRepository.updateLastLoginAt(
            user.id,
            loginTimestamp,
        );

        return createdSession;
    });

    return {
        session: {
            id: session.id,
            userId: session.user_id,
            expiresAt: session.expires_at,
        },
        sessionToken,
        sessionExpiresAt,
        cookie: buildSessionCookieOptions(sessionToken, sessionExpiresAt),
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