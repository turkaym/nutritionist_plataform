import { NextResponse } from "next/server";

import { withProtectedRoute } from "@/server/auth/http/with-protected-route";

export const GET = withProtectedRoute(async (_request, actor) => {
    return NextResponse.json(
        {
            success: true,
            data: {
                domain: "me",
                route: "purchases",
                userId: actor.user.id,
                message: "Protected customer purchases placeholder endpoint.",
            },
        },
        { status: 200 },
    );
});