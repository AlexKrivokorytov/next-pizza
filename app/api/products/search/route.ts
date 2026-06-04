import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withApiHandler } from '@/lib/api-handler';
import { ProductsService } from '@/lib/db/products';
import { meili, PRODUCTS_INDEX } from '@/lib/meili';
import { withCache } from '@/lib/cache';

const searchSchema = z.object({
  query: z.string().min(1, 'Search query cannot be empty'),
});

/**
 * Searches Meilisearch first; falls back to Prisma full-text search.
 * Results are cached in Redis for 30 seconds per query.
 *
 * @param query - The search query string.
 * @returns Array of matching products with id, name, imageUrl, description.
 */
async function searchProducts(query: string) {
  const cacheKey = `search:${query.toLowerCase()}`;

  return withCache(
    cacheKey,
    async () => {
      try {
        const index = meili.index(PRODUCTS_INDEX);
        const result = await index.search(query, { limit: 8 });

        if (result.hits.length > 0) {
          return result.hits;
        }
      } catch {
        // Meilisearch unavailable — fall through to Prisma
        console.warn('[Search] Meilisearch unavailable, falling back to Prisma');
      }

      // Prisma fallback
      return ProductsService.search(query, 8);
    },
    30, // 30 second TTL on search results
  );
}

/**
 * Handles GET /api/products/search?query=<string>
 * Uses Meilisearch for typo-tolerant full-text search with Redis caching.
 */
export const GET = withApiHandler(async (req: NextRequest) => {
  const queryStr = req.nextUrl.searchParams.get('query') || '';
  const { query } = searchSchema.parse({ query: queryStr });

  const products = await searchProducts(query);

  return NextResponse.json({ products });
});
