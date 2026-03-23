import { drizzle } from "drizzle-orm/d1";
import webpush from "web-push";
import { subscriptionsTable } from "../db/schema";

export async function reminder(env: Env) {
  const db = drizzle(env.D1_DB);

  const allSubscriptions = await db.select().from(subscriptionsTable);

  const payload = JSON.stringify({
    title: "Presence reminder",
    body: "Don't forget to mark you presence",
    url: "/",
  });

  await Promise.allSettled(
    allSubscriptions.map((subscription) =>
      webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          expirationTime: subscription.expirationTime,
          keys: {
            auth: subscription.auth,
            p256dh: subscription.p256dh,
          },
        },
        payload,
        { urgency: "high", TTL: 60 * 60 * 24 },
      ),
    ),
  );
}
