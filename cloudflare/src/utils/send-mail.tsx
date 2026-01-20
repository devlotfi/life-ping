import Email from "../../emails/email";
import { resend } from "../resend";

export async function sendMail(emails: string[], name: string) {
  const { error } = await resend.emails.send({
    from: "Life Ping <lifeping@resend.dev>",
    to: emails,
    subject: "Inactivity Alert",
    react: <Email></Email>,
  });

  if (error) {
    console.error("Resend error:", JSON.stringify(error));
  } else {
    console.log("Alert emails sent");
  }
}
