import { resend } from "../resend";
import { AlertEmail } from "../templates/alert-email";

export async function sendMail(emails: string[], name: string, lastPing: Date) {
  const { error } = await resend.emails.send({
    from: "Life Ping <lifeping@resend.dev>",
    to: emails,
    subject: `Inactivity Alert (${name})`,
    html: AlertEmail({
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
