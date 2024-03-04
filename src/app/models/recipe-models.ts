import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ignoreElements } from 'rxjs';

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
  pinch = 'pinch',
}

export interface Ingredient {
  quantity: number;
  unit: Unit;
  product: string;
}

export interface RecipeSubmission {
  title: string;
  description: string;
  instruction: string;
  ingredients: Ingredient[];
  img?: string;
  authorId: number;
}
export interface Recipe extends RecipeSubmission {
  id: number;
}
export interface recipeAdditionalDetails {
  recipeId: number;
  authorId: number;
}

export interface RecipeEdit {
  recipe: Recipe;
  additionalInfo: recipeAdditionalDetails;
}

export type RecipeKeys = keyof Recipe;
