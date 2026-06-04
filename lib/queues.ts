import { Queue } from 'bullmq';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// BullMQ bundles its own ioredis version, so we pass the URL directly
// to avoid type conflicts between the two ioredis copies.
const connection = { url: REDIS_URL };

/** Payload for an order receipt email job. */
export type EmailJobData = 
  | { type: 'ORDER_RECEIPT'; orderId: number }
  | { type: 'PROFILE_UPDATE'; email: string; fullName: string };

/** Singleton BullMQ queue for outbound email jobs. */
const emailQueue = new Queue<EmailJobData>('email', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 200,
  },
});

/**
 * Enqueues an order receipt email for async delivery.
 *
 * @param orderId - The ID of the order to send the receipt for.
 */
async function enqueueOrderReceipt(orderId: number): Promise<void> {
  await emailQueue.add('order-receipt', { type: 'ORDER_RECEIPT', orderId });
  console.log(`[Queue] Enqueued order receipt for order #${orderId}`);
}

/**
 * Enqueues a profile update email for async delivery.
 */
export async function enqueueProfileUpdate(email: string, fullName: string): Promise<void> {
  await emailQueue.add('profile-update', { type: 'PROFILE_UPDATE', email, fullName });
  console.log(`[Queue] Enqueued profile update email for ${email}`);
}
