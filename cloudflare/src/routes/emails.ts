import { Hono } from "hono";
import { HonoBindings } from "../types/hono-bindings";
import { EMAILS_KEY } from "../constants";
import z from "zod";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { ErrorSchema } from "../types/error-schema";

const emails = new OpenAPIHono<HonoBindings>();

emails.openapi(
  createRoute({
    method: "get",
    path: "/",
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
    responses: {
      200: {
        content: {
          "application/json": {
            schema: z.array(z.email()),
          },
        },
        description: "Get emails",
      },
    },
  }),
  async (c) => {
    const data = await c.env.LIFE_PING_KV.get<string[]>(EMAILS_KEY, "json");
    return c.json(data || [], 200);
  },
);

emails.openapi(
  createRoute({
    method: "post",
    path: "/",
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.array(z.email()),
          },
        },
      },
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
        description: "Set emails",
      },
      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Error",
      },
    },
  }),
  async (c) => {
    const json = await c.req.valid("json");
    await c.env.LIFE_PING_KV.put(EMAILS_KEY, JSON.stringify(json));
    return c.json({ success: true }, 200);
  },
);

export { emails };
