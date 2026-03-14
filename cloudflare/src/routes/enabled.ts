import { HonoBindings } from "../types/hono-bindings";
import { ENABLED_KEY, PING_KEY } from "../constants";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const enabledRoutes = new OpenAPIHono<HonoBindings>();

enabledRoutes.openapi(
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
              enabled: z.boolean(),
            }),
          },
        },
        description: "Set emails",
      },
    },
  }),
  async (c) => {
    const value = await c.env.KV.get(ENABLED_KEY);
    return c.json({
      lastPing: value,
    });
  },
);

enabledRoutes.openapi(
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
    await c.env.KV.put(PING_KEY, now.toString());
    return c.json({
      success: true,
    });
  },
);

export { enabledRoutes };
