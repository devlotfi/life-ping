import { Hono } from "hono";
import { Resend } from "resend";
import { env } from "cloudflare:workers";

type Env = {
  KV: KVNamespace;
  API_SECRET: string;
  RESEND_API_KEY: string;
};

const app = new Hono<{ Bindings: Env }>();
const resend = new Resend(env.RESEND_API_KEY);

const EMAILS_KEY = "emails";
const PING_KEY = "last_ping";

// ---------------------
// Simple Auth Middleware
// ---------------------

app.use("*", async (c, next) => {
  const key = c.req.header("x-api-key");

  if (!key || key !== c.env.API_SECRET) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  await next();
});

// ---------------------
// GET Emails
// ---------------------

app.get("/emails", async (c) => {
  const data = await c.env.KV.get<string[]>(EMAILS_KEY, "json");

  return c.json({
    emails: data || [],
  });
});

// ---------------------
// POST Emails
// ---------------------

app.post("/emails", async (c) => {
  const body = await c.req.json<{ emails: string[] }>();

  if (!Array.isArray(body.emails)) {
    return c.json({ error: "Invalid format" }, 400);
  }

  await c.env.KV.put(EMAILS_KEY, JSON.stringify(body.emails));

  return c.json({ success: true });
});

// ---------------------
// Ping Endpoint
// ---------------------

app.post("/ping", async (c) => {
  const now = Date.now();

  await c.env.KV.put(PING_KEY, now.toString());

  return c.json({
    success: true,
    timestamp: now,
  });
});

// ---------------------
// Export fetch handler
// ---------------------

export default {
  fetch: app.fetch,

  // ---------------------
  // Scheduled Job
  // ---------------------

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(runHealthCheck(env));
  },
};

// ---------------------
// Health Check Logic
// ---------------------

async function runHealthCheck(env: Env) {
  const lastPingRaw = await env.KV.get(PING_KEY);

  if (!lastPingRaw) {
    console.log("No ping data yet");
    return;
  }

  const lastPing = Number(lastPingRaw);
  const now = Date.now();

  const HOURS_24 = 5 * 60 * 1000;

  if (now - lastPing < HOURS_24) {
    console.log("Service is healthy");
    return;
  }

  console.log("Ping expired — sending alert emails");

  const emails = await env.KV.get<string[]>(EMAILS_KEY, "json");

  if (!emails || emails.length === 0) {
    console.log("No emails configured");
    return;
  }

  await sendAlertEmails(env, emails);
}

// ---------------------
// Resend Integration
// ---------------------

async function sendAlertEmails(env: Env, recipients: string[]) {
  const { error } = await resend.emails.send({
    from: "Life Ping <lifeping@resend.dev>",
    to: recipients,
    subject: "Inactivity Alert",
    html: `
        <h2>⚠ Service Offline</h2>
        <p>No ping received for more than 24 hours.</p>
      `,
  });

  if (error) {
    console.error("Resend error:", JSON.stringify(error));
  } else {
    console.log("Alert emails sent");
  }
}
