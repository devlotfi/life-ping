import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const contacts = sqliteTable("Contacts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").unique().notNull(),
  language: text("language", { enum: ["en", "fr", "ar"] })
    .notNull()
    .default("en"),
  email: text("email").unique(),
  phone_number: text("phone_number").unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s','now'))`,
  ),
});
