import type { NextRequest } from "next/server";

import type { ProtectedRouteHandler } from "@/server/auth/http/protected-route-handler";
import { mapAuthErrorToResponse } from "@/server/auth/http/map-auth-error";
import { requireAuth } from "@/server/auth/guards/require-auth";

export function withProtectedRoute(handler: ProtectedRouteHandler) {
    return async function protectedRoute(request: NextRequest): Promise<Response> {
        try {
            const actor = await requireAuth(request);

            return await handler(request, actor);
        } catch (error) {
            return mapAuthErrorToResponse(error);
        }
    };
}