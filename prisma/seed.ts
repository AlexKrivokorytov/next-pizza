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
      name: 'Fresh Pepperoni',
      imageUrl: '/pizzas/pepperoni_fresh.avif',
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

  const pizza4 = await prisma.product.create({
    data: {
      name: 'Margarita',
      imageUrl: '/pizzas/cheese.webp',
      categoryId: 1,
      ingredients: {
        connect: ingredients.slice(1, 3).concat(ingredients.slice(10, 11)), // Mozzarella, Cheddar, Fresh tomatoes
      },
    },
  });

  const pizza5 = await prisma.product.create({
    data: {
      name: 'Meat Overload',
      imageUrl: '/pizzas/pepperoni_fresh.webp',
      categoryId: 1,
      ingredients: {
        connect: ingredients.slice(6, 9).concat(ingredients.slice(16, 17)), // Ham, Pepperoni, Chorizo, Meatballs
      },
    },
  });

  const pizza6 = await prisma.product.create({
    data: {
      name: 'Hawaiian',
      imageUrl: '/pizzas/hypnotica.png',
      categoryId: 1,
      ingredients: {
        connect: ingredients.slice(6, 7).concat(ingredients.slice(12, 13)), // Ham, Pineapple
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

      // Pizza "Margarita"
      generateProductItem({ productId: pizza4.id, pizzaType: 1, size: 20 }),
      generateProductItem({ productId: pizza4.id, pizzaType: 1, size: 30 }),
      generateProductItem({ productId: pizza4.id, pizzaType: 2, size: 40 }),

      // Pizza "Meat Overload"
      generateProductItem({ productId: pizza5.id, pizzaType: 1, size: 20 }),
      generateProductItem({ productId: pizza5.id, pizzaType: 2, size: 30 }),
      generateProductItem({ productId: pizza5.id, pizzaType: 2, size: 40 }),

      // Pizza "Hawaiian"
      generateProductItem({ productId: pizza6.id, pizzaType: 1, size: 20 }),
      generateProductItem({ productId: pizza6.id, pizzaType: 2, size: 30 }),
      generateProductItem({ productId: pizza6.id, pizzaType: 2, size: 40 }),

      // Other products
      generateProductItem({ productId: 1 }), // Omelet ham/mushrooms

      generateProductItem({ productId: 2 }), // Omelet pepperoni

      // Breakfast Latte variants
      { productId: 3, price: 2.50, size: 300 },
      { productId: 3, price: 3.20, size: 400 },
      { productId: 3, price: 3.80, size: 500 },

      generateProductItem({ productId: 4 }), // Denwich

      // Chicken nuggets variants (6, 9, 12 pcs)
      { productId: 5, price: 3.50, size: 6 },
      { productId: 5, price: 4.80, size: 9 },
      { productId: 5, price: 5.90, size: 12 },

      generateProductItem({ productId: 6 }), // Potatoes
      generateProductItem({ productId: 7 }), // Dodster
      generateProductItem({ productId: 8 }), // Spicy Dodster

      // Milkshake variants (300, 500 ml)
      { productId: 9, price: 2.90, size: 300 },
      { productId: 9, price: 3.90, size: 500 },
      { productId: 10, price: 2.90, size: 300 },
      { productId: 10, price: 3.90, size: 500 },
      { productId: 11, price: 3.20, size: 300 },
      { productId: 11, price: 4.20, size: 500 },
      { productId: 12, price: 2.70, size: 300 },
      { productId: 12, price: 3.70, size: 500 },

      // Hot drinks variants (300, 400, 500 ml)
      { productId: 13, price: 2.80, size: 300 },
      { productId: 13, price: 3.50, size: 400 },
      { productId: 13, price: 4.10, size: 500 },

      { productId: 14, price: 2.80, size: 300 },
      { productId: 14, price: 3.50, size: 400 },
      { productId: 14, price: 4.10, size: 500 },

      { productId: 15, price: 2.90, size: 300 },
      { productId: 15, price: 3.60, size: 400 },
      { productId: 15, price: 4.20, size: 500 },

      { productId: 16, price: 1.90, size: 300 },
      { productId: 16, price: 2.50, size: 400 },

      { productId: 17, price: 2.50, size: 300 },
      { productId: 17, price: 3.20, size: 400 },
      { productId: 17, price: 3.80, size: 500 },
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
