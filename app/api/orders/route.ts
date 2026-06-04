import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { stripe } from '@/lib/stripe';

interface CartItemPayload {
  id: string;
  name?: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  productItemId?: number;
  ingredients?: Array<{ id: number; name: string; price: number }>;
}

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  comment: z.string().optional(),
  totalAmount: z.number().positive('Total amount must be greater than zero'),
  items: z.custom<CartItemPayload[]>().refine((val) => Array.isArray(val) && val.length > 0, 'Cart cannot be empty'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const result = checkoutSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: 'Invalid form data', errors: result.error.format() },
        { status: 400 }
      );
    }
    
    const data = result.data;
    
    // Check for authenticated user to link order
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ? Number(session.user.id) : null;
    
    // Create the order in database
    const order = await prisma.order.create({
      data: {
        token: randomUUID(),
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        comment: data.comment || '',
        totalAmount: data.totalAmount,
        status: 'PENDING',
        items: JSON.parse(JSON.stringify(data.items)), // Prisma Json type
        ...(userId ? { user: { connect: { id: userId } } } : {}),
      },
    });
    
    // Note: In a real app, we'd clear the database cart here and send an email or payment link.
    // Since our cart is local-storage based Zustand, the client handles clearing its own cart.
    
    // Create Stripe Checkout Session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?cancelled=true`,
      customer_email: data.email,
      client_reference_id: order.id.toString(),
      metadata: {
        orderId: order.id.toString(),
      },
      line_items: data.items.map((item: CartItemPayload) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name || 'Pizza Item',
            images: item.imageUrl ? [item.imageUrl] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
    });

    // Update order with payment ID
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: stripeSession.id },
    });

    return NextResponse.json(
      { orderId: order.id, status: order.status, checkoutUrl: stripeSession.url, message: 'Order created successfully' }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/orders]:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
