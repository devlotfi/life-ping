import { healthCheck } from "./jobs/health-check";
import { Scalar } from "@scalar/hono-api-reference";
import { api } from "./api";
import { OpenAPIHono } from "@hono/zod-openapi";
import { HonoBindings } from "./types/hono-bindings";
import { reminder } from "./jobs/reminder";
import webpush from "web-push";
import { env } from "cloudflare:workers";

webpush.setVapidDetails(
  "mailto:test@test.com",
  env.VAPID_PUBLIC_KEY,
  env.VAPID_PRIVATE_KEY,
);

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
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
  ) {
    switch (controller.cron) {
      case "0 */12 * * *":
        ctx.waitUntil(reminder(env));
        break;
      case "0 */6 * * *":
        ctx.waitUntil(healthCheck(env));
        break;
    }
  },
} satisfies ExportedHandler<Env>;
