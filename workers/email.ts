import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import React from 'react';
import { prisma } from '../prisma/prisma-client';
import { OrderReceiptEmail } from '../emails/order-receipt';
import type { EmailJobData } from '../lib/queues';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const QUEUE_NAME = 'email';

// BullMQ worker requires maxRetriesPerRequest: null on the Redis connection
const connection = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

/**
 * Sends an order receipt email via Nodemailer using Ethereal (free test SMTP).
 *
 * @param orderId - The ID of the order to send the receipt for.
 * @param transporter - The Nodemailer transporter instance.
 */
async function sendOrderReceiptEmail(
  orderId: number,
  transporter: nodemailer.Transporter,
): Promise<void> {
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) {
    throw new Error(`Order #${orderId} not found in database`);
  }

  const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;

  const html = await render(
    React.createElement(OrderReceiptEmail, {
      orderId: order.id,
      fullName: order.fullName,
      totalAmount: order.totalAmount,
      address: order.address,
      items: items as Array<{ name: string; price: number; quantity: number }>,
    }),
  );

  const info = await transporter.sendMail({
    from: '"Next Pizza" <orders@nextpizza.com>',
    to: order.email,
    subject: `Receipt for your Order #${order.id}`,
    html,
  });

  console.log(`[Worker] ✅ Email sent to ${order.email}`);
  console.log(`[Worker] 🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
}

async function sendProfileUpdateEmail(
  email: string,
  fullName: string,
  transporter: nodemailer.Transporter,
): Promise<void> {
  const info = await transporter.sendMail({
    from: '"Next Pizza" <info@nextpizza.com>',
    to: email,
    subject: `Profile Updated Successfully`,
    html: `<div>
      <h1>Hello, ${fullName}!</h1>
      <p>Your Next Pizza profile details were successfully updated.</p>
      <p>If you did not make these changes, please contact support immediately.</p>
    </div>`,
  });

  console.log(`[Worker] ✅ Profile update email sent to ${email}`);
  console.log(`[Worker] 🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
}

async function main(): Promise<void> {
  console.log('[Worker] Starting BullMQ email worker...');

  // Setup Nodemailer with Ethereal (free email testing)
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  console.log(`[Worker] Ethereal account ready: ${testAccount.user}`);

  // BullMQ worker uses the raw ioredis connection directly
  const worker = new Worker<EmailJobData>(
    QUEUE_NAME,
    async (job) => {
      console.log(`[Worker] Processing job ${job.id}: ${JSON.stringify(job.data)}`);

      if (job.data.type === 'ORDER_RECEIPT') {
        await sendOrderReceiptEmail(job.data.orderId, transporter);
      } else if (job.data.type === 'PROFILE_UPDATE') {
        await sendProfileUpdateEmail(job.data.email, job.data.fullName, transporter);
      }
    },
    {
      connection: connection as any,
      concurrency: 2,
    },
  );

  worker.on('completed', (job) => {
    console.log(`[Worker] Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed: ${err.message}`);
  });

  worker.on('error', (err) => {
    console.error('[Worker] Worker error:', err);
  });

  console.log(`[Worker] Listening on queue "${QUEUE_NAME}"...`);
}

main().catch((err) => {
  console.error('[Worker] Fatal startup error:', err);
  process.exit(1);
});
