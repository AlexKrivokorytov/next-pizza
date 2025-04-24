export const mapPizzaSize = {
  20: 'small',
  30: 'medium',
  40: 'large',
} as const;
export const mapPizzaType = {
  1: 'traditional',
  2: 'thin',
} as const;

export const pizzaSizes = Object.entries(mapPizzaSize).map(([value, name]) => ({
  name,
  value,
}));

export const pizzaTypes = Object.entries(mapPizzaType).map(([value, name]) => ({
  name,
  value,
}));

export type PizzaSize = keyof typeof mapPizzaSize;
export type PizzaType = keyof typeof mapPizzaType;
