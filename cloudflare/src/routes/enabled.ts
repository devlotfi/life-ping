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
        description: "Get enabled status",
      },
    },
  }),
  async (c) => {
    const value = await c.env.KV.get(ENABLED_KEY);
    return c.json({
      enabled: value === "true" ? true : false,
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
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              enabled: z.boolean(),
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
        description: "Set enabled",
      },
    },
  }),
  async (c) => {
    const json = await c.req.valid("json");
    await c.env.KV.put(ENABLED_KEY, JSON.stringify(json.enabled));
    return c.json({ success: true }, 200);
  },
);

export { enabledRoutes };
