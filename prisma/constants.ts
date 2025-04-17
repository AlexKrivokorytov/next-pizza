export const categories = [
  {
    name: 'Pizzas',
  },
  {
    name: 'Breakfast',
  },
  {
    name: 'Snacks',
  },
  {
    name: 'Cocktails',
  },
  {
    name: 'Drinks',
  },
];

export const ingredients = [
  {
    name: 'Cheese crust',
    price: 1.92,
    imageUrl: '/ingredients/cheese_crust.png',
  },
  {
    name: 'Mozzarella',
    price: 0.85,
    imageUrl: '/ingredients/mozzarella.png',
  },
  {
    name: 'Cheddar and parmesan cheese',
    price: 0.85,
    imageUrl: '/ingredients/cheddar&parmesancheese.png',
  },
  {
    name: 'Jalapeno pepper',
    price: 0.63,
    imageUrl: '/ingredients/jalapeno_pepper.png',
  },
  {
    name: 'Tender chicken',
    price: 0.85,
    imageUrl: '/ingredients/tender chicken.png',
  },
  {
    name: 'Mushrooms',
    price: 0.63,
    imageUrl: '/ingredients/mushrooms.png',
  },
  {
    name: 'Ham',
    price: 0.85,
    imageUrl: '/ingredients/ham.png',
  },
  {
    name: 'Pepperoni',
    price: 0.85,
    imageUrl: '/ingredients/pepperoni.png',
  },
  {
    name: 'Chorizo',
    price: 0.85,
    imageUrl: '/ingredients/chorizo.png',
  },
  {
    name: 'Pickled cucumbers',
    price: 0.63,
    imageUrl: '/ingredients/pickled cucumbers.png',
  },
  {
    name: 'Fresh tomatoes',
    price: 0.63,
    imageUrl: '/ingredients/fresh tomatoes.png',
  },
  {
    name: 'Red onion',
    price: 0.63,
    imageUrl: '/ingredients/red onion.png',
  },
  {
    name: 'Pineapple',
    price: 0.63,
    imageUrl: '/ingredients/pineapple.png',
  },
  {
    name: 'Italian herbs',
    price: 0.42,
    imageUrl: '/ingredients/italian herbs.png',
  },
  {
    name: 'Sweet pepper',
    price: 0.63,
    imageUrl: '/ingredients/sweet pepper.png',
  },
  {
    name: 'Bryndza cheese',
    price: 0.85,
    imageUrl: '/ingredients/bryndza cheese.png',
  },
  {
    name: 'Meatballs',
    price: 0.85,
    imageUrl: '/ingredients/meatballs.png',
  },
].map((obj, index) => ({ id: index + 1, ...obj }));

export const products = [
  {
    name: 'Omelet with ham and mushrooms',
    imageUrl: '/products/omelet with ham and mushrooms.webp',
    categoryId: 2,
  },
  {
    name: 'Omelet with pepperoni',
    imageUrl: '/products/omelet with pepperoni.webp',
    categoryId: 2,
  },
  {
    name: 'Coffee Latte',
    imageUrl: '/products/coffee latte.webp',
    categoryId: 2,
  },
  {
    name: 'Denwich ham and cheese',
    imageUrl: '/products/denwich ham and cheese.webp',
    categoryId: 3,
  },
  {
    name: 'Chicken nuggets',
    imageUrl: '/products/chicken nuggets.avif',
    categoryId: 3,
  },
  {
    name: 'Baked potatoes with sauce 🌱',
    imageUrl: '/products/baked potatoes.webp',
    categoryId: 3,
  },
  {
    name: 'Dodster',
    imageUrl: '/products/dodster.webp',
    categoryId: 3,
  },
  {
    name: 'Spicy Dodster 🌶️🌶️',
    imageUrl: '/products/spicy dodster.webp',
    categoryId: 3,
  },
  {
    name: 'Banana milkshake',
    imageUrl: '/products/banana milkshake.webp',
    categoryId: 4,
  },
  {
    name: 'Caramel apple milkshake',
    imageUrl: '/products/caramel apple milkshake.webp',
    categoryId: 4,
  },
  {
    name: 'Oreo milkshake',
    imageUrl: '/products/oreo milkshake.webp',
    categoryId: 4,
  },
  {
    name: 'Classic milkshake 👶',
    imageUrl: '/products/classic milkshake.webp',
    categoryId: 4,
  },
  {
    name: 'Irish cappuccino',
    imageUrl: '/products/irish cappuchino.avif',
    categoryId: 5,
  },
  {
    name: 'Caramel cappuccino',
    imageUrl: '/products/caramel cappuchino.webp',
    categoryId: 5,
  },
  {
    name: 'Coconut latte',
    imageUrl: '/products/coconut latte.webp',
    categoryId: 5,
  },
  {
    name: 'Americano coffee',
    imageUrl: '/products/americano coffe.webp',
    categoryId: 5,
  },
  {
    name: 'Coffee Latte',
    imageUrl: '/products/coffee latte.webp',
    categoryId: 5,
  },
];
