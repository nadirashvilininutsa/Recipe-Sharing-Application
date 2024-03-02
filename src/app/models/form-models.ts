import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Unit } from './recipe-models';

export interface LogInForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

export interface RegisterForm {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
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

export interface SearchRecipeForm {
  title: FormControl<string | null>;
  ingredient: FormControl<string | null>;
}
