import { Hono } from "hono";
import { apiKeyMiddleware } from "./middlewares/api-key-middleware";
import { HonoBindings } from "./types/hono-bindings";
import { ping } from "./routes/ping";
import { emails } from "./routes/emails";
import { OpenAPIHono } from "@hono/zod-openapi";
import { name } from "./routes/name";

const api = new OpenAPIHono<HonoBindings>();

api.use("*", apiKeyMiddleware);

api.openAPIRegistry.registerComponent("securitySchemes", "ApiKeyAuth", {
  type: "apiKey",
  in: "header",
  name: "x-api-key",
});

api.route("/ping", ping);
api.route("/emails", emails);
api.route("/name", name);

export { api };
