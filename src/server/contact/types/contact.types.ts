export interface CreateContactMessageInput {
    fullName: string;
    email: string;
    phone?: string | null;
    subject?: string | null;
    message: string;
}

export interface UpdateContactMessageStatusInput {
    messageId: string;
    status: "new" | "in_progress" | "resolved" | "archived";
    resolvedAt?: Date | null;
}