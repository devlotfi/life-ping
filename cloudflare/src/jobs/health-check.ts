import { EMAILS_KEY, NAME_KEY, PING_KEY } from "../constants";
import { sendMail } from "../utils/send-mail";

export async function healthCheck(env: Env) {
  const lastPingRaw = await env.LIFE_PING_KV.get(PING_KEY);

  if (!lastPingRaw) {
    console.log("No ping data yet");
    return;
  }

  const lastPing = Number(lastPingRaw);
  const lastPingDate = new Date(Number(lastPingRaw));
  const now = Date.now();

  const HOURS_24 = 24 * 60 * 60 * 1000;
  //const HOURS_24 = 5 * 60 * 1000;

  if (now - lastPing < HOURS_24) {
    console.log("Service is healthy");
    return;
  }

  console.log("Ping expired — sending alert emails");

  const emails = await env.LIFE_PING_KV.get<string[]>(EMAILS_KEY, "json");
  const name = await env.LIFE_PING_KV.get(NAME_KEY, "text");

  if (!name || !emails || emails.length === 0) {
    console.log("No emails or name configured");
    return;
  }

  await sendMail(emails, name, lastPingDate);
}
