import { Contact } from "../db/schema";
import { resend } from "../resend";
import { AlertEmailEN } from "../templates/alert-email-en";
import { AlertEmailAR } from "../templates/alert-email-ar";
import { AlertEmailFR } from "../templates/alert-email-fr";

export async function sendMail(
  contacts: Contact[],
  name: string,
  lastPing: Date,
) {
  // 1. Filter out contacts without emails and group by language
  const grouped = contacts.reduce(
    (acc, contact) => {
      if (!contact.email) return acc;

      const lang = contact.language; // "en" | "fr" | "ar"
      if (!acc[lang]) acc[lang] = [];

      acc[lang].push(contact.email);
      return acc;
    },
    {} as Record<Contact["language"], string[]>,
  );

  // 2. Map over the groups and send emails
  // Using Promise.allSettled so one failure doesn't stop the others
  const emailPromises = Object.entries(grouped).map(async ([lang, emails]) => {
    // Select the template based on language
    const template =
      {
        en: AlertEmailEN,
        fr: AlertEmailFR, // Assuming these exist
        ar: AlertEmailAR,
      }[lang as Contact["language"]] || AlertEmailEN;

    const { error } = await resend.emails.send({
      from: "Life Ping <lifeping@resend.dev>",
      to: emails,
      subject: `Inactivity Alert (${name})`,
      html: template({ name, lastPing }),
    });

    if (error) {
      console.error(`Resend error (${lang}):`, JSON.stringify(error));
    } else {
      console.log(`Alert emails sent for language: ${lang}`);
    }
  });

  await Promise.allSettled(emailPromises);
}
