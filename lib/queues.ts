import { Queue } from 'bullmq';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// BullMQ bundles its own ioredis version, so we pass the URL directly
// to avoid type conflicts between the two ioredis copies.
const connection = { url: REDIS_URL };

/** Payload for an order receipt email job. */
export interface OrderReceiptJobData {
  type: 'ORDER_RECEIPT';
  orderId: number;
}

/** Singleton BullMQ queue for outbound email jobs. */
export const emailQueue = new Queue<OrderReceiptJobData>('email', {
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
export async function enqueueOrderReceipt(orderId: number): Promise<void> {
  await emailQueue.add('order-receipt', { type: 'ORDER_RECEIPT', orderId });
  console.log(`[Queue] Enqueued order receipt for order #${orderId}`);
}
