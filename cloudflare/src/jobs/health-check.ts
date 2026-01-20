import { EMAILS_KEY, PING_KEY } from "../constants";
import { sendMail } from "../utils/send-mail";

export async function healthCheck(env: Env) {
  const lastPingRaw = await env.LIFE_PING_KV.get(PING_KEY);

  if (!lastPingRaw) {
    console.log("No ping data yet");
    return;
  }

  const lastPing = Number(lastPingRaw);
  const now = Date.now();

  const HOURS_24 = 24 * 60 * 60 * 1000;

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

  await sendMail(emails, "lol");
}
