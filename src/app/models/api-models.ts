export enum Unit {
  g = 'g',
  ml = 'ml',
  oz = 'oz',
  lb = 'lb',
  kg = 'kg',
  tsp = 'tsp',
  tbsp = 'tbsp',
  cup = 'Cup',
  fluidOunce = 'Fluid ounce',
  pint = 'Pint',
  quart = 'Quart',
  milligram = 'Milligram',
  liter = 'Liter',
  gal = 'gal',
  dL = 'dL',
  cL = 'cL',
  piece = 'piece',
}

export interface Ingredient {
  quantity: number;
  unit: Unit;
  product: string;
}

export interface Recipe {
  title: string;
  description: string;
  instruction: string;
  ingredients: Ingredient[];
  img: string;
  recipeId: number;
  authorId: number;
}
