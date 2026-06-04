import { enqueueProfileUpdate } from '../queues';

/**
 * Service class for handling all email dispatch operations.
 * Abstracts the background queue (BullMQ) or direct sending logic from the rest of the application.
 */
export class EmailService {
  /**
   * Sends a profile update notification email via the background queue.
   * @param email - The recipient email address
   * @param fullName - The recipient's full name
   */
  static async sendProfileUpdateNotification(email: string, fullName: string): Promise<void> {
    try {
      await enqueueProfileUpdate(email, fullName);
    } catch (error) {
      console.error('Failed to dispatch profile update email:', error);
      // Depending on strictness, we might throw or silently fail. 
      // For notifications, silent failure on the worker side dispatch is often preferred.
    }
  }

  // Future methods like sendOrderReceipt(orderId) can be added here
}
