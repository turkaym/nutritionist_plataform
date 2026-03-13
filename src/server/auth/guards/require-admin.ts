import type { NextRequest } from "next/server";

import type { AuthenticatedActor } from "@/server/auth/contracts/authenticated-actor";
import { requireRole } from "@/server/auth/guards/require-role";

export async function requireAdmin(
    request: NextRequest,
): Promise<AuthenticatedActor> {
    return requireRole(request, "admin");
}