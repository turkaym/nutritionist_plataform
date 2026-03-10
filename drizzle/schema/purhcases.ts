import { relations } from "drizzle-orm";
import {
    index,
    integer,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
} from "drizzle-orm/pg-core";

import { users } from "./auth";
import {
    createdAtColumn,
    currencyCodeEnum,
    deliveredAtColumn,
    deliveryChannelEnum,
    deliveryStatusEnum,
    paidAtColumn,
    paymentProviderEnum,
    paymentStatusEnum,
    purchaseStatusEnum,
    updatedAtColumn,
} from "./common";
import { services } from "./services";

export const purchases = pgTable(
    "purchases",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        user_id: uuid("user_id")
            .notNull()
            .references(() => users.id, {
                onDelete: "restrict",
                onUpdate: "cascade",
            }),
        status: purchaseStatusEnum("status").default("pending").notNull(),
        currency_code: currencyCodeEnum("currency_code").default("ARS").notNull(),
        total_amount: integer("total_amount").notNull(),
        paid_at: paidAtColumn(),
        cancelled_at: timestamp("cancelled_at", { withTimezone: true }),
        refunded_at: timestamp("refunded_at", { withTimezone: true }),
        notes: text("notes"),
        created_at: createdAtColumn(),
        updated_at: updatedAtColumn(),
    },
    (table) => ({
        purchasesUserIdx: index("purchases_user_idx").on(table.user_id),
        purchasesStatusIdx: index("purchases_status_idx").on(table.status),
        purchasesCreatedAtIdx: index("purchases_created_at_idx").on(
            table.created_at,
        ),
    }),
);

export const purchaseItems = pgTable(
    "purchase_items",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        purchase_id: uuid("purchase_id")
            .notNull()
            .references(() => purchases.id, {
                onDelete: "cascade",
                onUpdate: "cascade",
            }),
        service_id: uuid("service_id").references(() => services.id, {
            onDelete: "restrict",
            onUpdate: "cascade",
        }),
        quantity: integer("quantity").default(1).notNull(),
        unit_price_amount: integer("unit_price_amount").notNull(),
        line_total_amount: integer("line_total_amount").notNull(),
        currency_code: currencyCodeEnum("currency_code").default("ARS").notNull(),
        service_title_snapshot: text("service_title_snapshot").notNull(),
        service_slug_snapshot: text("service_slug_snapshot").notNull(),
        service_short_description_snapshot: text("service_short_description_snapshot"),
        created_at: createdAtColumn(),
    },
    (table) => ({
        purchaseItemsPurchaseIdx: index("purchase_items_purchase_idx").on(
            table.purchase_id,
        ),
        purchaseItemsServiceIdx: index("purchase_items_service_idx").on(
            table.service_id,
        ),
    }),
);

export const payments = pgTable(
    "payments",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        purchase_id: uuid("purchase_id")
            .notNull()
            .references(() => purchases.id, {
                onDelete: "restrict",
                onUpdate: "cascade",
            }),
        provider: paymentProviderEnum("provider")
            .default("mercado_pago")
            .notNull(),
        status: paymentStatusEnum("status").default("pending").notNull(),
        external_payment_id: text("external_payment_id"),
        external_preference_id: text("external_preference_id"),
        external_reference: text("external_reference"),
        amount: integer("amount").notNull(),
        currency_code: currencyCodeEnum("currency_code").default("ARS").notNull(),
        provider_response_raw: text("provider_response_raw"),
        approved_at: timestamp("approved_at", { withTimezone: true }),
        failed_at: timestamp("failed_at", { withTimezone: true }),
        refunded_at: timestamp("refunded_at", { withTimezone: true }),
        created_at: createdAtColumn(),
        updated_at: updatedAtColumn(),
    },
    (table) => ({
        paymentsPurchaseIdx: index("payments_purchase_idx").on(table.purchase_id),
        paymentsStatusIdx: index("payments_status_idx").on(table.status),
        paymentsProviderIdx: index("payments_provider_idx").on(table.provider),
        paymentsExternalPaymentIdUniqueIdx: uniqueIndex(
            "payments_external_payment_id_unique_idx",
        ).on(table.external_payment_id),
        paymentsExternalPreferenceIdIdx: index(
            "payments_external_preference_id_idx",
        ).on(table.external_preference_id),
        paymentsExternalReferenceIdx: index("payments_external_reference_idx").on(
            table.external_reference,
        ),
    }),
);

export const deliveryRecords = pgTable(
    "delivery_records",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        purchase_id: uuid("purchase_id")
            .notNull()
            .references(() => purchases.id, {
                onDelete: "restrict",
                onUpdate: "cascade",
            }),
        payment_id: uuid("payment_id").references(() => payments.id, {
            onDelete: "set null",
            onUpdate: "cascade",
        }),
        user_id: uuid("user_id")
            .notNull()
            .references(() => users.id, {
                onDelete: "restrict",
                onUpdate: "cascade",
            }),
        channel: deliveryChannelEnum("channel").default("email").notNull(),
        status: deliveryStatusEnum("status").default("pending").notNull(),
        recipient_email: text("recipient_email").notNull(),
        delivery_subject: text("delivery_subject"),
        delivery_payload_snapshot: text("delivery_payload_snapshot"),
        provider_message_id: text("provider_message_id"),
        error_message: text("error_message"),
        delivered_at: deliveredAtColumn(),
        failed_at: timestamp("failed_at", { withTimezone: true }),
        created_at: createdAtColumn(),
        updated_at: updatedAtColumn(),
    },
    (table) => ({
        deliveryRecordsPurchaseIdx: index("delivery_records_purchase_idx").on(
            table.purchase_id,
        ),
        deliveryRecordsPaymentIdx: index("delivery_records_payment_idx").on(
            table.payment_id,
        ),
        deliveryRecordsUserIdx: index("delivery_records_user_idx").on(table.user_id),
        deliveryRecordsStatusIdx: index("delivery_records_status_idx").on(
            table.status,
        ),
        deliveryRecordsChannelIdx: index("delivery_records_channel_idx").on(
            table.channel,
        ),
    }),
);

export const purchasesRelations = relations(purchases, ({ one, many }) => ({
    user: one(users, {
        fields: [purchases.user_id],
        references: [users.id],
    }),
    items: many(purchaseItems),
    payments: many(payments),
    deliveryRecords: many(deliveryRecords),
}));

export const purchaseItemsRelations = relations(purchaseItems, ({ one }) => ({
    purchase: one(purchases, {
        fields: [purchaseItems.purchase_id],
        references: [purchases.id],
    }),
    service: one(services, {
        fields: [purchaseItems.service_id],
        references: [services.id],
    }),
}));

export const paymentsRelations = relations(payments, ({ one, many }) => ({
    purchase: one(purchases, {
        fields: [payments.purchase_id],
        references: [purchases.id],
    }),
    deliveryRecords: many(deliveryRecords),
}));

export const deliveryRecordsRelations = relations(
    deliveryRecords,
    ({ one }) => ({
        purchase: one(purchases, {
            fields: [deliveryRecords.purchase_id],
            references: [purchases.id],
        }),
        payment: one(payments, {
            fields: [deliveryRecords.payment_id],
            references: [payments.id],
        }),
        user: one(users, {
            fields: [deliveryRecords.user_id],
            references: [users.id],
        }),
    }),
);