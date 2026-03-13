import { NextResponse } from "next/server";

import { withAdminRoute } from "@/server/auth/http/with-admin-route";

export const GET = withAdminRoute(async () => {
    return NextResponse.json(
        {
            success: true,
            data: {
                domain: "admin",
                route: "users",
                message: "Protected admin placeholder endpoint.",
            },
        },
        { status: 200 },
    );
});