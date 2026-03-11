import { eq } from "drizzle-orm";

import { roles } from "@/../drizzle/schema";
import { database } from "@/server/shared/db/database";
import type { DatabaseExecutor } from "@/server/shared/db/types";

const roleSelect = {
    id: roles.id,
    code: roles.code,
    name: roles.name,
    description: roles.description,
    is_system: roles.is_system,
    created_at: roles.created_at,
    updated_at: roles.updated_at,
};

export function createRolesRepository(executor: DatabaseExecutor = database) {
    return {
        async findById(roleId: string) {
            const [role] = await executor
                .select(roleSelect)
                .from(roles)
                .where(eq(roles.id, roleId))
                .limit(1);

            return role ?? null;
        },

        async findByCode(roleCode: string) {
            const [role] = await executor
                .select(roleSelect)
                .from(roles)
                .where(eq(roles.code, roleCode))
                .limit(1);

            return role ?? null;
        },

        async findByName(roleName: string) {
            const [role] = await executor
                .select(roleSelect)
                .from(roles)
                .where(eq(roles.name, roleName))
                .limit(1);

            return role ?? null;
        },
    };
}