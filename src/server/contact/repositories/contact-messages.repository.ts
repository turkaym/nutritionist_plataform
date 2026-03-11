import { desc, eq } from "drizzle-orm";

import { contactMessages } from "@/../drizzle/schema";
import type {
    CreateContactMessageInput,
    UpdateContactMessageStatusInput,
} from "@/server/contact/types/contact.types";
import { database } from "@/server/shared/db/database";
import type { DatabaseExecutor } from "@/server/shared/db/types";

const contactMessageSelect = {
    id: contactMessages.id,
    full_name: contactMessages.full_name,
    email: contactMessages.email,
    phone: contactMessages.phone,
    subject: contactMessages.subject,
    message: contactMessages.message,
    status: contactMessages.status,
    resolved_at: contactMessages.resolved_at,
    created_at: contactMessages.created_at,
    updated_at: contactMessages.updated_at,
};

export function createContactMessagesRepository(
    executor: DatabaseExecutor = database,
) {
    return {
        async createContactMessage(input: CreateContactMessageInput) {
            const [contactMessage] = await executor
                .insert(contactMessages)
                .values({
                    full_name: input.fullName,
                    email: input.email.trim().toLowerCase(),
                    phone: input.phone ?? null,
                    subject: input.subject ?? null,
                    message: input.message,
                })
                .returning(contactMessageSelect);

            return contactMessage;
        },

        async listMessages() {
            const rows = await executor
                .select(contactMessageSelect)
                .from(contactMessages)
                .orderBy(desc(contactMessages.created_at));

            return rows;
        },

        async findById(messageId: string) {
            const [contactMessage] = await executor
                .select(contactMessageSelect)
                .from(contactMessages)
                .where(eq(contactMessages.id, messageId))
                .limit(1);

            return contactMessage ?? null;
        },

        async updateMessageStatus(input: UpdateContactMessageStatusInput) {
            const [contactMessage] = await executor
                .update(contactMessages)
                .set({
                    status: input.status,
                    resolved_at: input.resolvedAt ?? null,
                    updated_at: new Date(),
                })
                .where(eq(contactMessages.id, input.messageId))
                .returning(contactMessageSelect);

            return contactMessage ?? null;
        },
    };
}