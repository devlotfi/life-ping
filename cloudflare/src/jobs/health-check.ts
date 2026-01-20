import { EMAILS_KEY, PING_KEY } from "../constants";
import { resend } from "../resend";

export async function healthCheck(env: Env) {
  const lastPingRaw = await env.LIFE_PING_KV.get(PING_KEY);

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

  const emails = await env.LIFE_PING_KV.get<string[]>(EMAILS_KEY, "json");

  if (!emails || emails.length === 0) {
    console.log("No emails configured");
    return;
  }

  const { error } = await resend.emails.send({
    from: "Life Ping <lifeping@resend.dev>",
    to: emails,
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
