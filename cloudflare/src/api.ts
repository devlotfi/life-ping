import { apiKeyMiddleware } from "./middlewares/api-key-middleware";
import { HonoBindings } from "./types/hono-bindings";
import { OpenAPIHono } from "@hono/zod-openapi";
import { pingRoutes } from "./routes/ping";
import { nameRoutes } from "./routes/name";
import { contactsRoutes } from "./routes/contacts";
import { enabledRoutes } from "./routes/enabled";

const api = new OpenAPIHono<HonoBindings>();

api.use("*", apiKeyMiddleware);

api.openAPIRegistry.registerComponent("securitySchemes", "ApiKeyAuth", {
  type: "apiKey",
  in: "header",
  name: "x-api-key",
});

api.route("/enabled", enabledRoutes);
api.route("/ping", pingRoutes);
api.route("/name", nameRoutes);
api.route("/contacts", contactsRoutes);

export { api };
