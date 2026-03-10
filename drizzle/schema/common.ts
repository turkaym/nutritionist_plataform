import { pgEnum, timestamp, uuid } from "drizzle-orm/pg-core";

export const userStatusEnum = pgEnum("user_status", [
    "active",
    "inactive",
    "suspended",
]);

export const serviceStatusEnum = pgEnum("service_status", [
    "draft",
    "published",
    "archived",
]);

export const purchaseStatusEnum = pgEnum("purchase_status", [
    "pending",
    "paid",
    "failed",
    "cancelled",
    "refunded",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
    "pending",
    "approved",
    "rejected",
    "cancelled",
    "refunded",
    "failed",
]);

export const paymentProviderEnum = pgEnum("payment_provider", ["mercado_pago"]);

export const deliveryStatusEnum = pgEnum("delivery_status", [
    "pending",
    "sent",
    "failed",
]);

export const deliveryChannelEnum = pgEnum("delivery_channel", ["email"]);

export const blogPostStatusEnum = pgEnum("blog_post_status", [
    "draft",
    "published",
    "archived",
]);

export const contactMessageStatusEnum = pgEnum("contact_message_status", [
    "new",
    "in_progress",
    "resolved",
    "archived",
]);

export const currencyCodeEnum = pgEnum("currency_code", ["ARS"]);

export const auditActorTypeEnum = pgEnum("audit_actor_type", ["user"]);

export const createIdColumn = (name = "id") =>
    uuid(name).defaultRandom().primaryKey();

export const createdAtColumn = (name = "created_at") =>
    timestamp(name, { withTimezone: true }).defaultNow().notNull();

export const updatedAtColumn = (name = "updated_at") =>
    timestamp(name, { withTimezone: true }).defaultNow().notNull();

export const deletedAtColumn = (name = "deleted_at") =>
    timestamp(name, { withTimezone: true });

export const publishedAtColumn = (name = "published_at") =>
    timestamp(name, { withTimezone: true });

export const expiresAtColumn = (name = "expires_at") =>
    timestamp(name, { withTimezone: true });

export const paidAtColumn = (name = "paid_at") =>
    timestamp(name, { withTimezone: true });

export const deliveredAtColumn = (name = "delivered_at") =>
    timestamp(name, { withTimezone: true });