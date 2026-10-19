import { Resend } from "resend";
import { env } from "../lib/env";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmailNotification(
  name: string,
  email: string,
  message: string
): Promise<boolean> {
  try {
    const { error } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: [env.EMAIL_FROM],
      subject: `New Portfolio Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    if (error) {
      console.error("[Notification] Resend email delivery returned error");
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Notification] Resend email delivery request failed");
    return false;
  }
}
