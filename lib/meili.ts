import { Meilisearch } from 'meilisearch';

const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST || 'http://localhost:7700';
const MEILISEARCH_KEY = process.env.MEILISEARCH_KEY || 'nextpizza-meili-key';

/** Singleton Meilisearch client. */
export const meili = new Meilisearch({
  host: MEILISEARCH_HOST,
  apiKey: MEILISEARCH_KEY,
});

/** Name of the products index in Meilisearch. */
export const PRODUCTS_INDEX = 'products';

/**
 * Syncs a list of products into the Meilisearch index.
 * Creates the index if it does not exist.
 * Uses a partial-update (`addDocuments`) so existing documents are preserved.
 *
 * @param products - Array of products to index.
 */
export async function syncProductsToMeili(
  products: Array<{
    id: number;
    name: string;
    description: string | null;
    imageUrl: string;
    categoryId: number;
    baseIngredients: Array<{ name: string }>;
  }>,
): Promise<void> {
  const index = meili.index(PRODUCTS_INDEX);

  // Configure searchable and filterable attributes
  await index.updateSettings({
    searchableAttributes: ['name', 'description', 'ingredientNames'],
    filterableAttributes: ['categoryId'],
    sortableAttributes: ['name'],
  });

  const documents = products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description ?? '',
    imageUrl: p.imageUrl,
    categoryId: p.categoryId,
    // Flatten base ingredient names for full-text search
    ingredientNames: p.baseIngredients.map((i) => i.name).join(', '),
  }));

  await index.addDocuments(documents, { primaryKey: 'id' });
}
