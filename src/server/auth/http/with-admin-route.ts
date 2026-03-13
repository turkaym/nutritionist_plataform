import type { NextRequest } from "next/server";

import type { ProtectedRouteHandler } from "@/server/auth/http/protected-route-handler";
import { mapAuthErrorToResponse } from "@/server/auth/http/map-auth-error";
import { requireAdmin } from "@/server/auth/guards/require-admin";

export function withAdminRoute(handler: ProtectedRouteHandler) {
    return async function adminRoute(request: NextRequest): Promise<Response> {
        try {
            const actor = await requireAdmin(request);

            return await handler(request, actor);
        } catch (error) {
            return mapAuthErrorToResponse(error);
        }
    };
}