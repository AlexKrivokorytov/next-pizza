'use server';

import { prisma } from '@/prisma/prisma-client';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { OrderStatus, UserRole } from '@prisma/client';
import { syncProductsToMeili } from '@/lib/meili';
import { invalidateCache } from '@/lib/cache';

/**
 * Asserts the current session belongs to an admin.
 * Throws if unauthorized.
 */
async function assertAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required');
  }
  return session;
}

// ─── Orders ──────────────────────────────────────────────────────────────────

/**
 * Updates the status of an order.
 *
 * @param orderId - The ID of the order to update.
 * @param status - The new order status.
 */
export async function updateOrderStatus(orderId: number, status: OrderStatus) {
  await assertAdmin();
  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath('/admin/orders');
  revalidatePath('/admin');
}

// ─── Products ─────────────────────────────────────────────────────────────────

/**
 * Deletes a product and its associated product items.
 *
 * @param productId - The ID of the product to delete.
 */
export async function deleteProduct(productId: number) {
  await assertAdmin();
  await prisma.productItem.deleteMany({ where: { productId } });
  await prisma.product.delete({ where: { id: productId } });
  revalidatePath('/admin/products');
  revalidatePath('/admin');
}

/**
 * Creates a new product with its items, base ingredients, and add-ons.
 *
 * @param data - Product data including name, description, imageUrl, categoryId, price, and ingredient IDs.
 */
export async function createProduct(data: {
  name: string;
  description: string;
  imageUrl: string;
  categoryId: number;
  price: number;
  baseIngredients?: number[];
  ingredients?: number[];
}) {
  await assertAdmin();

  await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      categoryId: Number(data.categoryId),
      baseIngredients: {
        connect: (data.baseIngredients ?? []).map((id) => ({ id })),
      },
      ingredients: {
        connect: (data.ingredients ?? []).map((id) => ({ id })),
      },
      items: {
        create: [{ price: Number(data.price), size: null, pizzaType: null }],
      },
    },
  });

  revalidatePath('/admin/products');
  revalidatePath('/');

  // Sync to Meilisearch in the background — non-blocking
  void prisma.product
    .findMany({ include: { baseIngredients: { select: { name: true } } } })
    .then(syncProductsToMeili)
    .catch((err) => console.error('[Meili] Sync failed after createProduct:', err));
}

/**
 * Updates an existing product's details, ingredients, and add-ons.
 *
 * @param productId - The ID of the product to update.
 * @param data - Partial product data to update.
 */
export async function updateProduct(
  productId: number,
  data: {
    name?: string;
    description?: string;
    imageUrl?: string;
    categoryId?: number;
    baseIngredients?: number[];
    ingredients?: number[];
  },
) {
  await assertAdmin();

  await prisma.product.update({
    where: { id: productId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.imageUrl && { imageUrl: data.imageUrl }),
      ...(data.categoryId && { categoryId: Number(data.categoryId) }),
      ...(data.baseIngredients && {
        baseIngredients: {
          set: data.baseIngredients.map((id) => ({ id })),
        },
      }),
      ...(data.ingredients && {
        ingredients: {
          set: data.ingredients.map((id) => ({ id })),
        },
      }),
    },
  });

  revalidatePath('/admin/products');
  revalidatePath('/');

  // Sync updated product to Meilisearch in the background
  void prisma.product
    .findMany({ include: { baseIngredients: { select: { name: true } } } })
    .then(syncProductsToMeili)
    .catch((err) => console.error('[Meili] Sync failed after updateProduct:', err));
}

// ─── Ingredients ──────────────────────────────────────────────────────────────

/**
 * Creates a new ingredient.
 *
 * @param data - Ingredient name, price, and image URL.
 */
export async function createIngredient(data: { name: string; price: number; imageUrl: string }) {
  await assertAdmin();
  await prisma.ingredient.create({ data });
  await invalidateCache('ingredients:all');
  revalidatePath('/admin/ingredients');
}

/**
 * Updates an existing ingredient's details.
 *
 * @param ingredientId - The ID of the ingredient to update.
 * @param data - Partial ingredient data.
 */
export async function updateIngredient(
  ingredientId: number,
  data: { name?: string; price?: number; imageUrl?: string },
) {
  await assertAdmin();
  await prisma.ingredient.update({ where: { id: ingredientId }, data });
  await invalidateCache('ingredients:all');
  revalidatePath('/admin/ingredients');
  revalidatePath('/');
}

/**
 * Deletes an ingredient by ID.
 *
 * @param ingredientId - The ID of the ingredient to delete.
 */
export async function deleteIngredient(ingredientId: number) {
  await assertAdmin();
  await prisma.ingredient.delete({ where: { id: ingredientId } });
  await invalidateCache('ingredients:all');
  revalidatePath('/admin/ingredients');
}

// ─── Users ────────────────────────────────────────────────────────────────────

/**
 * Updates the role of a user.
 * Prevents admins from demoting themselves.
 *
 * @param userId - The ID of the user to update.
 * @param role - The new role to assign.
 */
export async function updateUserRole(userId: number, role: UserRole) {
  const session = await assertAdmin();

  if (session.user.id === userId.toString() && role === 'USER') {
    throw new Error('You cannot demote yourself');
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath('/admin/users');
}

// ─── Categories ───────────────────────────────────────────────────────────────

/**
 * Creates a new category.
 *
 * @param name - The name of the category.
 */
export async function createCategory(name: string) {
  await assertAdmin();
  await prisma.category.create({ data: { name } });
  revalidatePath('/admin/categories');
}
