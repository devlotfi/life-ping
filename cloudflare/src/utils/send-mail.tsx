import { resend } from "../resend";
import { AlertEmailEN } from "../templates/alert-email-en";

export async function sendMail(emails: string[], name: string, lastPing: Date) {
  const { error } = await resend.emails.send({
    from: "Life Ping <lifeping@resend.dev>",
    to: emails,
    subject: `Inactivity Alert (${name})`,
    html: AlertEmailEN({
      name,
      lastPing,
    }),
  });

  if (error) {
    console.error("Resend error:", JSON.stringify(error));
  } else {
    console.log("Alert emails sent");
  }
}
