import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendTelegramNotification, sendEmailNotification } from '@/lib/notifications';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const fullName = (body.fullName || body.name || '').trim();
    const email = (body.email || body.workEmail || '').trim();
    const message = (body.message || body.requirements || '').trim();

    if (!fullName || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Honeypot check if bot submitted invisible field
    if (body.website && String(body.website).trim().length > 0) {
      return NextResponse.json(
        { success: true, message: 'Message acknowledged.', id: 'ignored' },
        { status: 202 }
      );
    }

    // 1. Persist directly to Supabase PostgreSQL database
    const savedMessage = await prisma.contactMessage.create({
      data: {
        name: fullName,
        email: email,
        message: message,
        notifyStatus: 'PENDING',
      },
    });

    console.log('[Contact Stored in Database]:', {
      id: savedMessage.id,
      name: fullName,
      email: email,
      createdAt: savedMessage.createdAt,
    });

    // 2. Dispatch notifications asynchronously
    (async () => {
      try {
        const [tgSuccess, emailSuccess] = await Promise.all([
          sendTelegramNotification(fullName, email, message),
          sendEmailNotification(fullName, email, message),
        ]);

        let notifyStatus: 'SENT' | 'PARTIAL' | 'FAILED' = 'FAILED';
        let notifiedAt: Date | null = null;

        if (tgSuccess && emailSuccess) {
          notifyStatus = 'SENT';
          notifiedAt = new Date();
        } else if (tgSuccess || emailSuccess) {
          notifyStatus = 'PARTIAL';
          notifiedAt = new Date();
        }

        await prisma.contactMessage.update({
          where: { id: savedMessage.id },
          data: {
            notifyStatus,
            notifiedAt,
          },
        });
      } catch (notifyErr) {
        console.warn('[Notification Async Warning]:', notifyErr);
      }
    })();

    return NextResponse.json({
      success: true,
      message: 'Message dispatched successfully',
      id: savedMessage.id,
    });
  } catch (error: any) {
    console.error('[Consultation API Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to dispatch message.' },
      { status: 500 }
    );
  }
}
