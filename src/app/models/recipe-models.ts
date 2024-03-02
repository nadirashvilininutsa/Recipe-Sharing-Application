import { FormArray, FormControl, FormGroup } from '@angular/forms';

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
  img?: string;
  recipeId: number;
  authorId: number;
}

export interface NewIds {
  newRecipeId: number;
  newUserId: number;
}

export interface NewRecipeForm {
  title: FormControl<string | null>;
  description: FormControl<string | null>;
  instruction: FormControl<string | null>;
  ingredients: FormArray<FormGroup<IngredientsForm>>;
  image?: FormControl<[string] | null>;
}

export interface IngredientsForm {
  quantity: FormControl<number | null>;
  unit: FormControl<Unit | null>;
  ingredient: FormControl<string | null>;
}
