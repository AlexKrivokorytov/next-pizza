import { Prisma } from '@prisma/client';
import { categories, ingredients, products, pizzasData } from './constants';
import { prisma } from './prisma-client';
import { hashSync } from 'bcrypt';

const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) * 10 + min * 10) / 10;
};

const generateProductItem = ({
  productId,
  pizzaType,
  size,
}: {
  productId: number;
  pizzaType?: 1 | 2;
  size?: 20 | 30 | 40;
}) => {
  return {
    productId,
    price: randomNumber(5, 20),
    pizzaType,
    size,
  } as Prisma.ProductItemUncheckedCreateInput;
};

async function up() {
  await prisma.user.createMany({
    data: [
      {
        fullName: 'Jane Doe',
        email: 'Jane@example.com',
        password: hashSync('123456', 10),
        verified: new Date(Date.now()),
        role: 'USER',
      },
      {
        fullName: 'John Doe',
        email: 'John@example.com',
        password: hashSync('123456', 10),
        verified: new Date(Date.now()),
        role: 'ADMIN',
      },
    ],
  });

  await prisma.category.createMany({
    data: categories,
  });

  await prisma.ingredient.createMany({
    data: ingredients,
  });

  await prisma.product.createMany({
    data: products,
  });

  // Create pizzas
  const createdPizzas = [];
  for (const pizza of pizzasData) {
    const createdPizza = await prisma.product.create({
      data: {
        name: pizza.name,
        imageUrl: pizza.imageUrl,
        categoryId: pizza.categoryId,
        description: pizza.description,
        baseIngredients: {
          connect: pizza.baseIngredientIds.map((id) => ({ id })),
        },
        ingredients: {
          connect: pizza.addOnIds.map((id) => ({ id })),
        },
      },
    });
    createdPizzas.push(createdPizza);
  }

  // Generate variants
  const productItems: Prisma.ProductItemUncheckedCreateInput[] = [];

  // Generate variants for the 15 pizzas
  for (const pizza of createdPizzas) {
    productItems.push(generateProductItem({ productId: pizza.id, pizzaType: 1, size: 20 }));
    productItems.push(generateProductItem({ productId: pizza.id, pizzaType: 1, size: 30 }));
    productItems.push(generateProductItem({ productId: pizza.id, pizzaType: 1, size: 40 }));
    productItems.push(generateProductItem({ productId: pizza.id, pizzaType: 2, size: 20 }));
    productItems.push(generateProductItem({ productId: pizza.id, pizzaType: 2, size: 30 }));
    productItems.push(generateProductItem({ productId: pizza.id, pizzaType: 2, size: 40 }));
  }

  // Generate variants for other products (assuming they exist from the static products list)
  // Let's assume the products from `products` start after the pizzas.
  // Wait, the products created via createMany get IDs automatically. We don't have their exact IDs.
  // However, since we TRUNCATE tables, `products` created via createMany will have IDs 1 to N,
  // and then the pizzas will have IDs N+1 to N+15.
  // Let's adjust this: products array has 17 items (drinks, snacks, etc). So IDs 1 to 17.
  // Then pizzas will have IDs 18 to 32.

  productItems.push(
    generateProductItem({ productId: 1 }), // Omelet ham/mushrooms
    generateProductItem({ productId: 2 }), // Omelet pepperoni
    { productId: 3, price: 2.50, size: 300 } as Prisma.ProductItemUncheckedCreateInput,
    { productId: 3, price: 3.20, size: 400 } as Prisma.ProductItemUncheckedCreateInput,
    { productId: 3, price: 3.80, size: 500 } as Prisma.ProductItemUncheckedCreateInput,
    generateProductItem({ productId: 4 }), // Denwich
    { productId: 5, price: 3.50, size: 6 } as Prisma.ProductItemUncheckedCreateInput,
    { productId: 5, price: 4.80, size: 9 } as Prisma.ProductItemUncheckedCreateInput,
    { productId: 5, price: 5.90, size: 12 } as Prisma.ProductItemUncheckedCreateInput,
    generateProductItem({ productId: 6 }), // Potatoes
    generateProductItem({ productId: 7 }), // Dodster
    generateProductItem({ productId: 8 }), // Spicy Dodster
    { productId: 9, price: 2.90, size: 300 } as Prisma.ProductItemUncheckedCreateInput,
    { productId: 9, price: 3.90, size: 500 } as Prisma.ProductItemUncheckedCreateInput,
    { productId: 10, price: 2.90, size: 300 } as Prisma.ProductItemUncheckedCreateInput,
    { productId: 10, price: 3.90, size: 500 } as Prisma.ProductItemUncheckedCreateInput,
    { productId: 11, price: 3.20, size: 300 } as Prisma.ProductItemUncheckedCreateInput,
    { productId: 11, price: 4.20, size: 500 } as Prisma.ProductItemUncheckedCreateInput,
    { productId: 12, price: 2.70, size: 300 } as Prisma.ProductItemUncheckedCreateInput,
    { productId: 12, price: 3.70, size: 500 } as Prisma.ProductItemUncheckedCreateInput,
    { productId: 13, price: 2.80, size: 300 } as Prisma.ProductItemUncheckedCreateInput,
    { productId: 13, price: 3.50, size: 400 } as Prisma.ProductItemUncheckedCreateInput,
    { productId: 13, price: 4.10, size: 500 } as Prisma.ProductItemUncheckedCreateInput,
    { productId: 14, price: 2.80, size: 300 } as Prisma.ProductItemUncheckedCreateInput,
    { productId: 14, price: 3.50, size: 400 } as Prisma.ProductItemUncheckedCreateInput,
    { productId: 14, price: 4.10, size: 500 } as Prisma.ProductItemUncheckedCreateInput,
    { productId: 15, price: 2.90, size: 300 } as Prisma.ProductItemUncheckedCreateInput,
    { productId: 15, price: 3.60, size: 400 } as Prisma.ProductItemUncheckedCreateInput,
    { productId: 15, price: 4.20, size: 500 } as Prisma.ProductItemUncheckedCreateInput,
    { productId: 16, price: 1.90, size: 300 } as Prisma.ProductItemUncheckedCreateInput,
    { productId: 16, price: 2.50, size: 400 } as Prisma.ProductItemUncheckedCreateInput,
    { productId: 17, price: 2.50, size: 300 } as Prisma.ProductItemUncheckedCreateInput,
    { productId: 17, price: 3.20, size: 400 } as Prisma.ProductItemUncheckedCreateInput,
    { productId: 17, price: 3.80, size: 500 } as Prisma.ProductItemUncheckedCreateInput
  );

  await prisma.productItem.createMany({
    data: productItems,
  });

  await prisma.cart.createMany({
    data: [
      {
        userId: 1,
        totalAmount: 0,
        token: '11111',
      },
      {
        userId: 2,
        totalAmount: 0,
        token: '22222',
      },
    ],
  });

  await prisma.cartItem.create({
    data: {
      productItemId: 1,
      cartId: 1,
      quantity: 2,
      ingredients: {
        connect: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
    },
  });
}

async function down() {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "ProductItem" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Ingredient" RESTART IDENTITY CASCADE`;
}

async function main() {
  try {
    await down();
    await up();
  } catch (error) {
    console.error('Error running migrations:', error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
