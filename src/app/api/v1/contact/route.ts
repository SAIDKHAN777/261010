import { after } from "next/server";
import { defineHandler, readJsonBody } from "@/lib/http";
import { getClientIpIdentity } from "@/lib/ip";
import { checkContactRateLimit } from "@/infrastructure/ratelimit";
import { contactSchema } from "@/domain/contact";
import { prisma } from "@/lib/prisma";
import { sendTelegramNotification } from "@/infrastructure/telegram";
import { sendEmailNotification } from "@/infrastructure/resend";

export const runtime = "nodejs";

export const POST = defineHandler(async (request) => {
  const ipHash = getClientIpIdentity(request);
  await checkContactRateLimit(ipHash);

  const rawBody = await readJsonBody(request);
  const data = contactSchema.parse(rawBody);

  // Honeypot check
  if (data.website && data.website.trim().length > 0) {
    return new Response(
      JSON.stringify({ id: "ignored", status: "PENDING" }),
      {
        status: 202,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const created = await prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email,
      message: data.message,
      notifyStatus: "PENDING",
    },
  });

  after(async () => {
    try {
      const [tgSuccess, emailSuccess] = await Promise.all([
        sendTelegramNotification(data.name, data.email, data.message),
        sendEmailNotification(data.name, data.email, data.message),
      ]);

      let notifyStatus: "SENT" | "PARTIAL" | "FAILED" = "FAILED";
      let notifiedAt: Date | null = null;

      if (tgSuccess && emailSuccess) {
        notifyStatus = "SENT";
        notifiedAt = new Date();
      } else if (tgSuccess || emailSuccess) {
        notifyStatus = "PARTIAL";
        notifiedAt = new Date();
      }

      await prisma.contactMessage.update({
        where: { id: created.id },
        data: {
          notifyStatus,
          notifiedAt,
        },
      });
    } catch (err) {
      console.error("[ContactNotification] Background notification task failed");
    }
  });

  return new Response(
    JSON.stringify({ id: created.id, status: "PENDING" }),
    {
      status: 202,
      headers: { "Content-Type": "application/json" },
    }
  );
});
