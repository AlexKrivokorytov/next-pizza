import { NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { IngredientsService } from '@/lib/db/ingredients';
import { withCache } from '@/lib/cache';

const CACHE_KEY = 'ingredients:all';
const CACHE_TTL = 300; // 5 minutes

/**
 * Handles GET requests to fetch all ingredients.
 * Response is cached in Redis for 5 minutes.
 */
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ApiError } from '@/lib/api-handler';

export const GET = withApiHandler(async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new ApiError('Unauthorized', 401);
  }

  const ingredients = await withCache(CACHE_KEY, () => IngredientsService.getAll(), CACHE_TTL);
  return NextResponse.json(ingredients);
});
