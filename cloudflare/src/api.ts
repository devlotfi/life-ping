import { apiKeyMiddleware } from "./middlewares/api-key-middleware";
import { HonoBindings } from "./types/hono-bindings";
import { OpenAPIHono } from "@hono/zod-openapi";
import { pingRoutes } from "./routes/ping";
import { nameRoutes } from "./routes/name";
import { contactsRoutes } from "./routes/contacts";
import { enabledRoutes } from "./routes/enabled";
import { subscriptions } from "./routes/subscriptions";
import { cors } from "hono/cors";

const api = new OpenAPIHono<HonoBindings>();

api.use("*", cors());
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
api.route("/subscriptions", subscriptions);

export { api };
