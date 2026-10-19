import { env } from "../lib/env";

export async function sendTelegramNotification(
  name: string,
  email: string,
  message: string
): Promise<boolean> {
  try {
    const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const text = `📬 *New Contact Message*\n\n*Name:* ${name}\n*Email:* ${email}\n\n*Message:*\n${message}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_ADMIN_CHAT_ID,
        text,
        parse_mode: "Markdown",
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("[Notification] Telegram delivery request failed");
    return false;
  }
}
