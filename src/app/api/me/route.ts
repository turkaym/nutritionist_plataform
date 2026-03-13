import { NextResponse } from "next/server";

import { withProtectedRoute } from "@/server/auth/http/with-protected-route";

export const GET = withProtectedRoute(async (_request, actor) => {
    return NextResponse.json(
        {
            success: true,
            data: {
                user: actor.user,
                session: {
                    id: actor.sessionId,
                    userId: actor.sessionUserId,
                    expiresAt: actor.sessionExpiresAt,
                },
            },
        },
        { status: 200 },
    );
});