import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "@/server/auth/constants/auth.constants";
import { resolveCurrentSession } from "@/server/auth/services/current-session.service";
import { mapAuthErrorToResponse } from "@/server/auth/http/map-auth-error";

export async function GET(request: NextRequest) {
    try {
        const sessionToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;

        const result = await resolveCurrentSession(sessionToken);

        return NextResponse.json(
            {
                success: true,
                data: {
                    user: result.user,
                    session: result.session,
                },
            },
            { status: 200 },
        );
    } catch (error) {
        return mapAuthErrorToResponse(error);
    }
}