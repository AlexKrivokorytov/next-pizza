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
    description: 'Hot hearty omelet with ham, mushrooms and cheese',
  },
  {
    name: 'Omelet with pepperoni',
    imageUrl: '/products/omelet with pepperoni.webp',
    categoryId: 2,
    description: 'Hearty omelet with spicy pepperoni, tomatoes and mozzarella cheese',
  },
  {
    name: 'Coffee Latte',
    imageUrl: '/products/coffee latte.webp',
    categoryId: 2,
    description: 'Classic rich coffee with lots of milk',
  },
  {
    name: 'Denwich ham and cheese',
    imageUrl: '/products/denwich ham and cheese.webp',
    categoryId: 3,
    description: 'Hot sandwich with chicken ham, mozzarella, tomatoes and sauce',
  },
  {
    name: 'Chicken nuggets',
    imageUrl: '/products/chicken nuggets.avif',
    categoryId: 3,
    description: 'Tender chicken breast pieces in crispy breading',
  },
  {
    name: 'Baked potatoes with sauce 🌱',
    imageUrl: '/products/baked potatoes.webp',
    categoryId: 3,
    description: 'Oven-baked potato wedges with aromatic spices',
  },
  {
    name: 'Dodster',
    imageUrl: '/products/dodster.webp',
    categoryId: 3,
    description: 'Legendary hot roll with chicken, tomatoes, mozzarella, ranch sauce in thin wheat tortilla',
  },
  {
    name: 'Spicy Dodster 🌶️🌶️',
    imageUrl: '/products/spicy dodster.webp',
    categoryId: 3,
    description: 'Hot roll with spicy jalapeno, chicken, tomatoes, mozzarella and barbecue sauce',
  },
  {
    name: 'Banana milkshake',
    imageUrl: '/products/banana milkshake.webp',
    categoryId: 4,
    description: 'Sweet and creamy milkshake with natural banana flavor',
  },
  {
    name: 'Caramel apple milkshake',
    imageUrl: '/products/caramel apple milkshake.webp',
    categoryId: 4,
    description: 'Delicious mix of milk, ice cream, apple flavor and sweet caramel',
  },
  {
    name: 'Oreo milkshake',
    imageUrl: '/products/oreo milkshake.webp',
    categoryId: 4,
    description: 'Ice cream and milk with crushed Oreo cookies',
  },
  {
    name: 'Classic milkshake 👶',
    imageUrl: '/products/classic milkshake.webp',
    categoryId: 4,
    description: 'Pure and simple vanilla milkshake',
  },
  {
    name: 'Irish cappuccino',
    imageUrl: '/products/irish cappuchino.avif',
    categoryId: 5,
    description: 'Classic cappuccino with Irish cream syrup',
  },
  {
    name: 'Caramel cappuccino',
    imageUrl: '/products/caramel cappuchino.webp',
    categoryId: 5,
    description: 'Classic cappuccino enriched with sweet caramel syrup',
  },
  {
    name: 'Coconut latte',
    imageUrl: '/products/coconut latte.webp',
    categoryId: 5,
    description: 'Hot latte made with delicate coconut milk and espresso',
  },
  {
    name: 'Americano coffee',
    imageUrl: '/products/americano coffe.webp',
    categoryId: 5,
    description: 'Rich and bold espresso diluted with hot water',
  },
  {
    name: 'Coffee Latte',
    imageUrl: '/products/coffee latte.webp',
    categoryId: 5,
    description: 'Classic hot drink with espresso and steamed milk',
  },
];

// Helper to easily get ingredient IDs by name for the seed
const ing = (names: string[]) => {
  const map: Record<string, number> = {
    'Cheese crust': 1,
    'Mozzarella': 2,
    'Cheddar and parmesan cheese': 3,
    'Jalapeno pepper': 4,
    'Tender chicken': 5,
    'Mushrooms': 6,
    'Ham': 7,
    'Pepperoni': 8,
    'Chorizo': 9,
    'Pickled cucumbers': 10,
    'Fresh tomatoes': 11,
    'Red onion': 12,
    'Pineapple': 13,
    'Italian herbs': 14,
    'Sweet pepper': 15,
    'Bryndza cheese': 16,
    'Meatballs': 17,
  };
  return names.map(n => map[n]).filter(Boolean);
};

export const pizzasData = [
  {
    name: 'Fresh Pepperoni',
    imageUrl: '/pizzas/pepperoni_fresh.avif',
    categoryId: 1,
    description: 'Spicy pepperoni, extra mozzarella, signature tomato sauce',
    baseIngredientIds: ing(['Pepperoni', 'Mozzarella']),
    addOnIds: ing(['Cheese crust', 'Jalapeno pepper', 'Mushrooms', 'Red onion']),
  },
  {
    name: 'Cheese',
    imageUrl: '/pizzas/cheese.webp',
    categoryId: 1,
    description: 'Mozzarella, cheddar, parmesan, cream sauce',
    baseIngredientIds: ing(['Mozzarella', 'Cheddar and parmesan cheese']),
    addOnIds: ing(['Cheese crust', 'Mushrooms', 'Tender chicken', 'Bryndza cheese']),
  },
  {
    name: 'Chorizo fresh',
    imageUrl: '/pizzas/chorizo fresh.webp',
    categoryId: 1,
    description: 'Spicy chorizo, sweet pepper, mozzarella, signature tomato sauce',
    baseIngredientIds: ing(['Chorizo', 'Sweet pepper', 'Mozzarella']),
    addOnIds: ing(['Jalapeno pepper', 'Mushrooms', 'Red onion']),
  },
  {
    name: 'Margarita',
    imageUrl: '/pizzas/cheese.webp',
    categoryId: 1,
    description: 'Fresh tomatoes, mozzarella, italian herbs, signature tomato sauce',
    baseIngredientIds: ing(['Fresh tomatoes', 'Mozzarella', 'Italian herbs']),
    addOnIds: ing(['Cheese crust', 'Cheddar and parmesan cheese', 'Tender chicken']),
  },
  {
    name: 'Meat Overload',
    imageUrl: '/pizzas/pepperoni_fresh.webp',
    categoryId: 1,
    description: 'Tender chicken, ham, pepperoni, chorizo, meatballs, mozzarella, barbecue sauce',
    baseIngredientIds: ing(['Tender chicken', 'Ham', 'Pepperoni', 'Chorizo', 'Meatballs', 'Mozzarella']),
    addOnIds: ing(['Jalapeno pepper', 'Red onion', 'Cheese crust']),
  },
  {
    name: 'Hawaiian',
    imageUrl: '/pizzas/hypnotica.png',
    categoryId: 1,
    description: 'Ham, sweet pineapple, mozzarella, signature tomato sauce',
    baseIngredientIds: ing(['Ham', 'Pineapple', 'Mozzarella']),
    addOnIds: ing(['Tender chicken', 'Jalapeno pepper', 'Cheese crust']),
  },
  {
    name: 'Mushroom Truffle',
    imageUrl: '/pizzas/cheese.webp',
    categoryId: 1,
    description: 'Fresh mushrooms, mozzarella, truffle sauce, red onion, cheddar',
    baseIngredientIds: ing(['Mushrooms', 'Mozzarella', 'Red onion', 'Cheddar and parmesan cheese']),
    addOnIds: ing(['Ham', 'Tender chicken', 'Italian herbs']),
  },
  {
    name: 'Mexican',
    imageUrl: '/pizzas/chorizo fresh.webp',
    categoryId: 1,
    description: 'Tender chicken, spicy jalapeno, red onion, sweet pepper, tomatoes, mozzarella, salsa sauce',
    baseIngredientIds: ing(['Tender chicken', 'Jalapeno pepper', 'Red onion', 'Sweet pepper', 'Fresh tomatoes', 'Mozzarella']),
    addOnIds: ing(['Chorizo', 'Cheese crust', 'Bryndza cheese']),
  },
  {
    name: 'Four Cheeses',
    imageUrl: '/pizzas/cheese.webp',
    categoryId: 1,
    description: 'Mozzarella, cheddar, parmesan, bryndza, cream sauce, italian herbs',
    baseIngredientIds: ing(['Mozzarella', 'Cheddar and parmesan cheese', 'Bryndza cheese', 'Italian herbs']),
    addOnIds: ing(['Cheese crust', 'Mushrooms', 'Pineapple']),
  },
  {
    name: 'Burger Pizza',
    imageUrl: '/pizzas/pepperoni_fresh.avif',
    categoryId: 1,
    description: 'Meatballs, ham, pickled cucumbers, fresh tomatoes, red onion, mozzarella, burger sauce',
    baseIngredientIds: ing(['Meatballs', 'Ham', 'Pickled cucumbers', 'Fresh tomatoes', 'Red onion', 'Mozzarella']),
    addOnIds: ing(['Jalapeno pepper', 'Cheese crust', 'Pepperoni']),
  },
  {
    name: 'Veggie',
    imageUrl: '/pizzas/hypnotica.png',
    categoryId: 1,
    description: 'Mushrooms, sweet pepper, fresh tomatoes, red onion, bryndza, mozzarella, italian herbs, tomato sauce',
    baseIngredientIds: ing(['Mushrooms', 'Sweet pepper', 'Fresh tomatoes', 'Red onion', 'Bryndza cheese', 'Mozzarella', 'Italian herbs']),
    addOnIds: ing(['Jalapeno pepper', 'Cheese crust']),
  },
  {
    name: 'BBQ Chicken',
    imageUrl: '/pizzas/chorizo fresh.webp',
    categoryId: 1,
    description: 'Tender chicken, bacon, red onion, mozzarella, barbecue sauce',
    baseIngredientIds: ing(['Tender chicken', 'Red onion', 'Mozzarella']),
    addOnIds: ing(['Mushrooms', 'Pickled cucumbers', 'Jalapeno pepper']),
  },
  {
    name: 'Double Pepperoni',
    imageUrl: '/pizzas/pepperoni_fresh.webp',
    categoryId: 1,
    description: 'Double portion of spicy pepperoni, extra mozzarella, tomato sauce',
    baseIngredientIds: ing(['Pepperoni', 'Mozzarella']),
    addOnIds: ing(['Jalapeno pepper', 'Chorizo', 'Cheese crust']),
  },
  {
    name: 'Ranch',
    imageUrl: '/pizzas/cheese.webp',
    categoryId: 1,
    description: 'Tender chicken, ham, fresh tomatoes, mozzarella, ranch sauce',
    baseIngredientIds: ing(['Tender chicken', 'Ham', 'Fresh tomatoes', 'Mozzarella']),
    addOnIds: ing(['Red onion', 'Mushrooms', 'Cheese crust']),
  },
  {
    name: 'Bavarian',
    imageUrl: '/pizzas/pepperoni_fresh.avif',
    categoryId: 1,
    description: 'Spicy chorizo, pickled cucumbers, red onion, fresh tomatoes, mustard sauce, mozzarella',
    baseIngredientIds: ing(['Chorizo', 'Pickled cucumbers', 'Red onion', 'Fresh tomatoes', 'Mozzarella']),
    addOnIds: ing(['Ham', 'Meatballs', 'Jalapeno pepper']),
  },
  {
    name: 'Arriva',
    imageUrl: '/pizzas/chorizo fresh.webp',
    categoryId: 1,
    description: 'Tender chicken, spicy chorizo, burger sauce, sweet pepper, red onion, tomatoes, mozzarella',
    baseIngredientIds: ing(['Tender chicken', 'Chorizo', 'Sweet pepper', 'Red onion', 'Fresh tomatoes', 'Mozzarella']),
    addOnIds: ing(['Cheese crust', 'Jalapeno pepper', 'Mushrooms']),
  },
  {
    name: 'Dodo Mix',
    imageUrl: '/pizzas/pepperoni_fresh.avif',
    categoryId: 1,
    description: 'Bacon, tender chicken, ham, mozzarella, tomatoes, red onion, garlic sauce',
    baseIngredientIds: ing(['Tender chicken', 'Ham', 'Mozzarella', 'Fresh tomatoes', 'Red onion']),
    addOnIds: ing(['Cheese crust', 'Chorizo', 'Pepperoni']),
  },
  {
    name: 'Pesto',
    imageUrl: '/pizzas/hypnotica.png',
    categoryId: 1,
    description: 'Tender chicken, pesto sauce, bryndza, tomatoes, mozzarella',
    baseIngredientIds: ing(['Tender chicken', 'Bryndza cheese', 'Fresh tomatoes', 'Mozzarella']),
    addOnIds: ing(['Cheese crust', 'Mushrooms', 'Red onion']),
  },
  {
    name: 'Four Seasons',
    imageUrl: '/pizzas/cheese.webp',
    categoryId: 1,
    description: 'Meatballs, pepperoni, tomatoes, mushrooms, mozzarella, tomato sauce',
    baseIngredientIds: ing(['Meatballs', 'Pepperoni', 'Fresh tomatoes', 'Mushrooms', 'Mozzarella']),
    addOnIds: ing(['Cheese crust', 'Jalapeno pepper', 'Red onion']),
  }
];
