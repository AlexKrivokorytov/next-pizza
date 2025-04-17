import { Prisma } from '@prisma/client';
import { categories, ingredients, products } from './constants';
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

  const pizza1 = await prisma.product.create({
    data: {
      name: 'Пепперони фреш',
      imageUrl: '/pizzas/pepperoni_fresh.webp',
      categoryId: 1,
      ingredients: {
        connect: ingredients.slice(0, 5),
      },
    },
  });

  const pizza2 = await prisma.product.create({
    data: {
      name: 'Cheese',
      imageUrl: '/pizzas/cheese.webp',
      categoryId: 1,
      ingredients: {
        connect: ingredients.slice(5, 10),
      },
    },
  });

  const pizza3 = await prisma.product.create({
    data: {
      name: 'Chorizo fresh',
      imageUrl: '/pizzas/chorizo fresh.webp',
      categoryId: 1,
      ingredients: {
        connect: ingredients.slice(10, 40),
      },
    },
  });

  await prisma.productItem.createMany({
    data: [
      // pizza "Pepperoni fresh"
      generateProductItem({
        productId: pizza1.id,
        pizzaType: 1,
        size: 20,
      }),
      generateProductItem({
        productId: pizza1.id,
        pizzaType: 2,
        size: 30,
      }),
      generateProductItem({
        productId: pizza1.id,
        pizzaType: 2,
        size: 40,
      }),

      // Pizza "Cheese"
      generateProductItem({
        productId: pizza2.id,
        pizzaType: 1,
        size: 20,
      }),
      generateProductItem({
        productId: pizza2.id,
        pizzaType: 1,
        size: 30,
      }),
      generateProductItem({
        productId: pizza2.id,
        pizzaType: 1,
        size: 40,
      }),
      generateProductItem({
        productId: pizza2.id,
        pizzaType: 2,
        size: 20,
      }),
      generateProductItem({
        productId: pizza2.id,
        pizzaType: 2,
        size: 30,
      }),
      generateProductItem({
        productId: pizza2.id,
        pizzaType: 2,
        size: 40,
      }),

      // Pizza "Chorizo fresh"
      generateProductItem({
        productId: pizza3.id,
        pizzaType: 1,
        size: 20,
      }),
      generateProductItem({
        productId: pizza3.id,
        pizzaType: 2,
        size: 30,
      }),
      generateProductItem({
        productId: pizza3.id,
        pizzaType: 2,
        size: 40,
      }),

      // Other products
      generateProductItem({ productId: 1 }),
      generateProductItem({ productId: 2 }),
      generateProductItem({ productId: 3 }),
      generateProductItem({ productId: 4 }),
      generateProductItem({ productId: 5 }),
      generateProductItem({ productId: 6 }),
      generateProductItem({ productId: 7 }),
      generateProductItem({ productId: 8 }),
      generateProductItem({ productId: 9 }),
      generateProductItem({ productId: 10 }),
      generateProductItem({ productId: 11 }),
      generateProductItem({ productId: 12 }),
      generateProductItem({ productId: 13 }),
      generateProductItem({ productId: 14 }),
      generateProductItem({ productId: 15 }),
      generateProductItem({ productId: 16 }),
      generateProductItem({ productId: 17 }),
    ],
  });

  await prisma.productItem.createMany({
    data: [],
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
