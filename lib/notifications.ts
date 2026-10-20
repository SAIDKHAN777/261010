// ======================================================================
// NOTIFICATION DISPATCH SERVICE (Telegram & Resend Email)
// ======================================================================

export async function sendTelegramNotification(
  name: string,
  email: string,
  message: string
): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!token || !chatId || token.includes('Example') || chatId.includes('123456789')) {
    // Placeholder or unconfigured tokens: skip gracefully
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const text = `📬 *New Contact Message*\n\n*Name:* ${name}\n*Email:* ${email}\n\n*Message:*\n${message}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
    });

    return res.ok;
  } catch (error) {
    console.warn('[Notification] Telegram delivery request failed:', error);
    return false;
  }
}

export async function sendEmailNotification(
  name: string,
  email: string,
  message: string
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'Said Khan Portfolio <notifications@saidkhan.dev>';

  if (!apiKey || apiKey.includes('placeholder')) {
    // Placeholder or unconfigured apiKey: skip gracefully
    return false;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [fromEmail],
        subject: `New Portfolio Contact Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      }),
    });

    return res.ok;
  } catch (error) {
    console.warn('[Notification] Resend delivery request failed:', error);
    return false;
  }
}
