import { Hono } from "hono";
import { HonoBindings } from "../types/hono-bindings";
import { EMAILS_KEY, NAME_KEY } from "../constants";
import z from "zod";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { ErrorSchema } from "../types/error-schema";

const name = new OpenAPIHono<HonoBindings>();

name.openapi(
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
            schema: z.object({
              name: z.string().nullable(),
            }),
          },
        },
        description: "Get name",
      },
    },
  }),
  async (c) => {
    const name = await c.env.LIFE_PING_KV.get(NAME_KEY, "text");
    return c.json(
      {
        name,
      },
      200,
    );
  },
);

name.openapi(
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
            schema: z.object({
              name: z.string().min(2),
            }),
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
        description: "Set name",
      },
    },
  }),
  async (c) => {
    const json = await c.req.valid("json");
    await c.env.LIFE_PING_KV.put(NAME_KEY, json.name);
    return c.json({ success: true }, 200);
  },
);

export { name };
