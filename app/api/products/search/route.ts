import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withApiHandler } from '@/lib/api-handler';
import { ProductsService } from '@/lib/db/products';

// Define the validation schema for the request
const searchSchema = z.object({
  query: z.string().min(1, 'Search query cannot be empty'),
});

/**
 * Handles GET requests to search for products by query string.
 */
export const GET = withApiHandler(async (req: NextRequest) => {
  // Extract and validate input
  const queryStr = req.nextUrl.searchParams.get('query') || '';
  const { query } = searchSchema.parse({ query: queryStr });

  // Call the service layer
  const products = await ProductsService.search(query);

  return NextResponse.json({ products });
});
