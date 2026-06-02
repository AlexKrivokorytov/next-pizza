import { NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { IngredientsService } from '@/lib/db/ingredients';

/**
 * Handles GET requests to fetch all ingredients.
 */
export const GET = withApiHandler(async () => {
  const ingredients = await IngredientsService.getAll();
  return NextResponse.json(ingredients);
});
