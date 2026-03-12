import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "@/server/auth/constants/auth.constants";
import { logoutUser } from "@/server/auth/services/logout.service";
import { mapAuthErrorToResponse } from "@/server/auth/http/map-auth-error";

export async function POST(request: NextRequest) {
    try {
        const sessionToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;

        const result = await logoutUser(sessionToken);

        const response = NextResponse.json(
            {
                success: true,
                data: {
                    loggedOut: true,
                },
            },
            { status: 200 },
        );

        response.cookies.set({
            name: result.cookie.name,
            value: result.cookie.value,
            httpOnly: result.cookie.httpOnly,
            secure: result.cookie.secure,
            sameSite: result.cookie.sameSite,
            path: result.cookie.path,
            expires: result.cookie.expires,
        });

        return response;
    } catch (error) {
        return mapAuthErrorToResponse(error);
    }
}