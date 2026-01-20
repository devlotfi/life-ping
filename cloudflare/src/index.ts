import { healthCheck } from "./jobs/health-check";
import { Scalar } from "@scalar/hono-api-reference";
import { api } from "./api";
import { OpenAPIHono } from "@hono/zod-openapi";
import { HonoBindings } from "./types/hono-bindings";

const app = new OpenAPIHono<HonoBindings>();

app.route("/api", api);

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Life Ping API",
  },
});

app.get("/scalar", Scalar({ url: "/doc" }));

export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(healthCheck(env));
  },
};
