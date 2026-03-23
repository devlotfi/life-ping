import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql, InferSelectModel } from "drizzle-orm";

export const contactsTable = sqliteTable("Contacts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").unique().notNull(),
  language: text("language", { enum: ["en", "fr", "ar"] })
    .notNull()
    .default("en"),
  email: text("email").unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s','now'))`,
  ),
});

export type Contact = InferSelectModel<typeof contactsTable>;

export const subscriptionsTable = sqliteTable("Subscriptions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  endpoint: text("endpoint").notNull().unique(),
  expirationTime: integer("expiration_time"),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s','now'))`,
  ),
});
