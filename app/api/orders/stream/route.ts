import { NextRequest } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const POLL_INTERVAL_MS = 3000;

/**
 * GET /api/orders/stream
 * Server-Sent Events endpoint that streams order status updates to the client.
 * Requires authentication. Polls the database every 3 seconds for changes.
 *
 * @param req - The incoming request (must contain orderId query param).
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const orderId = req.nextUrl.searchParams.get('orderId');

  if (!orderId || isNaN(Number(orderId))) {
    return new Response('Missing or invalid orderId', { status: 400 });
  }

  const encoder = new TextEncoder();
  let lastStatus = '';
  let intervalId: ReturnType<typeof setInterval>;

  const stream = new ReadableStream({
    start(controller) {
      const sendEvent = (data: Record<string, unknown>) => {
        const payload = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(payload));
      };

      // Send initial connection confirmation
      sendEvent({ type: 'connected', orderId: Number(orderId) });

      intervalId = setInterval(async () => {
        try {
          const order = await prisma.order.findUnique({
            where: { id: Number(orderId) },
            select: { status: true, id: true },
          });

          if (!order) {
            sendEvent({ type: 'error', message: 'Order not found' });
            clearInterval(intervalId);
            controller.close();
            return;
          }

          // Only send an event when the status actually changes
          if (order.status !== lastStatus) {
            lastStatus = order.status;
            sendEvent({ type: 'status_update', orderId: order.id, status: order.status });

            // Auto-close when order reaches a terminal state
            if (order.status === 'SUCCEEDED' || order.status === 'CANCELED') {
              clearInterval(intervalId);
              controller.close();
            }
          }
        } catch (err) {
          console.error('[SSE] Error polling order:', err);
          sendEvent({ type: 'error', message: 'Internal error' });
          clearInterval(intervalId);
          controller.close();
        }
      }, POLL_INTERVAL_MS);
    },
    cancel() {
      clearInterval(intervalId);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable Nginx buffering
    },
  });
}
