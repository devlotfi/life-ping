import { drizzle } from "drizzle-orm/d1";
import { ENABLED_KEY, NAME_KEY, PING_KEY } from "../constants";
import { sendMail } from "../utils/send-mail";
import { contactsTable } from "../db/schema";

export async function healthCheck(env: Env) {
  const lastPingRaw = await env.KV.get(PING_KEY);
  if (!lastPingRaw) {
    console.log("No ping data yet");
    return;
  }

  const enabledRaw = await env.KV.get(ENABLED_KEY);
  const enabled = enabledRaw ? JSON.parse(enabledRaw) : false;
  if (!enabled) {
    console.log("Not enabled");
    return;
  }

  const lastPing = Number(lastPingRaw);
  const lastPingDate = new Date(Number(lastPingRaw));
  const now = Date.now();

  const HOURS_48 = 48 * 60 * 60 * 1000;

  if (now - lastPing < HOURS_48) {
    console.log("Service is healthy");
    return;
  }

  console.log("Ping expired — sending alert emails");
  const db = drizzle(env.D1_DB);
  const contactList = await db.select().from(contactsTable).all();
  const name = await env.KV.get(NAME_KEY, "text");

  if (!name || !contactList || contactList.length === 0) {
    console.log("No contacts or name configured");
    return;
  }
  await sendMail(contactList, name, lastPingDate);
}
