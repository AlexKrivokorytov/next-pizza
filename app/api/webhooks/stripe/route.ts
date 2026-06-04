import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import { stripe } from '@/lib/stripe';
import { publishToQueue } from '@/lib/rabbitmq';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ message: 'Missing stripe signature' }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        await prisma.order.update({
          where: { id: Number(orderId) },
          data: { status: 'SUCCEEDED' },
        });
        console.log(`Order ${orderId} marked as SUCCEEDED.`);

        // Publish event to RabbitMQ for email processing
        await publishToQueue('email_queue', {
          type: 'ORDER_RECEIPT',
          orderId: Number(orderId),
        });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Stripe webhook error:', error.message);
    return NextResponse.json({ message: 'Webhook handler failed' }, { status: 400 });
  }
}
