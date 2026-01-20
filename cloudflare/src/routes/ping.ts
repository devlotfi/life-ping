import { HonoBindings } from "../types/hono-bindings";
import { PING_KEY } from "../constants";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const ping = new OpenAPIHono<HonoBindings>();

ping.openapi(
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
              lastPing: z.date().nullable(),
            }),
          },
        },
        description: "Set emails",
      },
    },
  }),
  async (c) => {
    const value = await c.env.LIFE_PING_KV.get(PING_KEY);
    return c.json({
      lastPing: value,
    });
  },
);

ping.openapi(
  createRoute({
    method: "post",
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
              success: z.boolean(),
            }),
          },
        },
        description: "Set emails",
      },
    },
  }),
  async (c) => {
    const now = Date.now();
    await c.env.LIFE_PING_KV.put(PING_KEY, now.toString());
    return c.json({
      success: true,
    });
  },
);

export { ping };
