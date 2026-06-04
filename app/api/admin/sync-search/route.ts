import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import { syncProductsToMeili } from '@/lib/meili';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * POST /api/admin/sync-search
 * Syncs all products to Meilisearch. Admin-only.
 * Call this after bulk product imports or to rebuild the search index.
 */
export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const products = await prisma.product.findMany({
      include: {
        baseIngredients: { select: { name: true } },
      },
    });

    await syncProductsToMeili(products);

    return NextResponse.json({ synced: products.length, message: 'Search index updated' });
  } catch (error) {
    console.error('[Sync Search] Failed:', error);
    return NextResponse.json({ error: 'Failed to sync search index' }, { status: 500 });
  }
}
