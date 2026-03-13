import type { NextRequest } from "next/server";

import type { AuthenticatedActor } from "@/server/auth/contracts/authenticated-actor";
import type { AuthRoleCode } from "@/server/auth/contracts/auth-role";
import { AUTH_ERROR_CODES } from "@/server/auth/contracts/auth-errors";
import { requireAuth } from "@/server/auth/guards/require-auth";
import { AppError } from "@/server/shared/errors/app-error";

export async function requireRole(
    request: NextRequest,
    allowedRoles: AuthRoleCode | AuthRoleCode[],
): Promise<AuthenticatedActor> {
    const actor = await requireAuth(request);

    const normalizedAllowedRoles = Array.isArray(allowedRoles)
        ? allowedRoles
        : [allowedRoles];

    const currentRoleCode = actor.user.role.code as AuthRoleCode;
    const isAllowed = normalizedAllowedRoles.includes(currentRoleCode);

    if (!isAllowed) {
        throw new AppError({
            code: AUTH_ERROR_CODES.UNAUTHORIZED,
            message: "You do not have permission to access this resource.",
        });
    }

    return actor;
}