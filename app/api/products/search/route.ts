import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../prisma/prisma-client';

/**
 * Handles GET requests to search for products by query string.
 *
 * @param req - Next.js request object containing the search query.
 * @returns JSON response with an array of matching products.
 */
export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query') || '';

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
    take: 5,
  });

  return NextResponse.json({ products });
}
