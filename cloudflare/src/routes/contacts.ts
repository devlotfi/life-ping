import { HonoBindings } from "../types/hono-bindings";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { contacts } from "../db/schema";
import { drizzle } from "drizzle-orm/d1";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { NAME_KEY, PING_KEY } from "../constants";
import { sendMail } from "../utils/send-mail";

const contactsRoutes = new OpenAPIHono<HonoBindings>();

const phoneRegex = /^\+[1-9]\d{7,14}$/;

export const contactSelectSchema = createSelectSchema(contacts);

export const contactInsertSchema = createInsertSchema(contacts, {
  email: z.email().optional().nullable(),
  phone_number: z
    .string()
    .regex(phoneRegex, "Phone must be in international format +XXXXXXXX")
    .optional()
    .nullable(),
}).omit({
  id: true,
  createdAt: true,
});

export const contactUpdateSchema = createUpdateSchema(contacts, {
  email: z.email().optional().nullable(),
  phone_number: z
    .string()
    .regex(phoneRegex, "Phone must be in international format +XXXXXXXX")
    .optional()
    .nullable(),
}).omit({
  id: true,
  createdAt: true,
});

contactsRoutes.openapi(
  createRoute({
    method: "get",
    path: "/",
    security: [{ ApiKeyAuth: [] }],
    responses: {
      200: {
        content: {
          "application/json": {
            schema: contactSelectSchema.array(),
          },
        },
        description: "Get contacts",
      },
    },
  }),
  async (c) => {
    const db = drizzle(c.env.D1_DB);
    const data = await db.select().from(contacts).all();
    return c.json(data, 200);
  },
);

contactsRoutes.openapi(
  createRoute({
    method: "post",
    path: "/",
    security: [{ ApiKeyAuth: [] }],
    request: {
      body: {
        content: {
          "application/json": {
            schema: contactInsertSchema,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: contactSelectSchema,
          },
        },
        description: "Add contact",
      },
    },
  }),
  async (c) => {
    const db = drizzle(c.env.D1_DB);
    const body = c.req.valid("json");
    const result = await db.insert(contacts).values(body).returning().get();
    return c.json(result, 200);
  },
);

contactsRoutes.openapi(
  createRoute({
    method: "patch",
    path: "/{id}",
    security: [{ ApiKeyAuth: [] }],
    request: {
      params: z.object({
        id: z.uuid(),
      }),
      body: {
        content: {
          "application/json": {
            schema: contactUpdateSchema,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: contactSelectSchema,
          },
        },
        description: "Update contact",
      },
    },
  }),
  async (c) => {
    const db = drizzle(c.env.D1_DB);
    const { id } = c.req.valid("param");
    console.log("uuid ", id);

    const body = c.req.valid("json");

    const result = await db
      .update(contacts)
      .set(body)
      .where(eq(contacts.id, id))
      .returning()
      .get();

    return c.json(result, 200);
  },
);

contactsRoutes.openapi(
  createRoute({
    method: "delete",
    path: "/{id}",
    security: [{ ApiKeyAuth: [] }],
    request: {
      params: z.object({
        id: z.uuid(),
      }),
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
            }),
          },
        },
        description: "Delete contact",
      },
    },
  }),
  async (c) => {
    const db = drizzle(c.env.D1_DB);
    const { id } = c.req.valid("param");

    await db.delete(contacts).where(eq(contacts.id, id));
    return c.json({ success: true }, 200);
  },
);

contactsRoutes.openapi(
  createRoute({
    method: "post",
    path: "/test",
    security: [{ ApiKeyAuth: [] }],
    responses: {
      200: {
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
            }),
          },
        },
        description: "Test email sending",
      },
    },
  }),
  async (c) => {
    const lastPingRaw = await c.env.KV.get(PING_KEY);
    const name = await c.env.KV.get(NAME_KEY, "text");

    if (!lastPingRaw) {
      console.log("No ping data yet");
      return c.json({ success: false }, 200);
    }

    const lastPingDate = new Date(Number(lastPingRaw));

    const db = drizzle(c.env.D1_DB);
    const contactList = await db.select().from(contacts).all();
    if (!name || !contactList || contactList.length === 0) {
      console.log("No contacts or name configured");
      return c.json({ success: false }, 200);
    }

    const emails = contactList
      .map((contact) => contact.email)
      .filter((contact) => contact !== null);
    await sendMail(emails, name, lastPingDate);
    return c.json({ success: true }, 200);
  },
);

export { contactsRoutes };
