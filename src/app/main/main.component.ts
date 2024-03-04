import { Component } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Recipe, RecipeEdit, RecipeSubmission } from '../models/recipe-models';
import {
  BehaviorSubject,
  Observable,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchRecipeForm } from '../models/form-models';
import { AuthService } from '../services/auth.service';
import { UserFullInto } from '../models/auth-models';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  recipes$: Observable<Recipe[]> = this.getRecipeList();
  filteredRecipes$: Observable<Recipe[]> = of();
  recipeDetails: Recipe | undefined;
  // userId?: number = this.authService.currentUserId;
  currentUser$: BehaviorSubject<UserFullInto | undefined> =
    this.authService.currentUserInfo$;

  getRecipeList(): Observable<Recipe[]> {
    return this.commonService.getRecipeList();
  }

  displayRecipeDetails(recipe: Recipe) {
    this.recipeDetails = recipe;
  }

  hideRecipeDetails() {
    this.recipeDetails = undefined;
  }

  form: FormGroup = this.buildForm();

  private buildForm() {
    return this.fb.group<SearchRecipeForm>({
      title: this.fb.control(''),
      ingredient: this.fb.control(''),
    });
  }

  filterRecipe() {
    const title: string = this.form.controls['title'].value.toLowerCase();
    const product: string =
      this.form.controls['ingredient'].value.toLowerCase();

    if (!title && !product) {
      this.filteredRecipes$ = this.recipes$;
      return;
    }

    this.filteredRecipes$ = this.recipes$.pipe(
      distinctUntilChanged(),
      debounceTime(500),
      map((recipes) =>
        recipes.filter((recipe) => {
          const matchTitle = recipe.title.toLowerCase().includes(title);
          const matchProduct = recipe.ingredients.filter((ingredient) =>
            ingredient.product.toLowerCase().includes(product)
          );

          if (title && product) {
            return matchTitle && matchProduct.length > 0 ? true : false;
          } else if (title && !product) {
            return matchTitle;
          } else if (product) {
            return matchProduct.length > 0;
          }
          return false;
        })
      )
    );
  }

  onRecipeEdit(recipe: RecipeEdit) {
    const updatedRecipe: Recipe = {
      title: recipe.recipe.title,
      description: recipe.recipe.description,
      instruction: recipe.recipe.instruction,
      ingredients: recipe.recipe.ingredients,
      img: recipe.recipe.img,
      authorId: recipe.additionalInfo.authorId,
      id: recipe.additionalInfo.recipeId,
    };

    this.commonService
      .updateRecipe(updatedRecipe, recipe.additionalInfo.recipeId)
      .pipe(
        take(1),
        tap(() => {
          this.recipes$ = this.getRecipeList();
          this.filteredRecipes$ = this.recipes$;
        })
      )
      .subscribe();
  }

  onRecipeDeleted(deletedRecipe: Recipe) {
    this.commonService
      .deleteRecipe(deletedRecipe.id)
      .pipe(
        take(1),
        tap(() => {
          this.recipes$ = this.getRecipeList();
          this.filteredRecipes$ = this.recipes$;
        })
      )
      .subscribe();
  }

  addToFavorites(recipeId: number) {
    this.currentUser$
      .pipe(
        take(1),
        switchMap((user) => {
          if (!user?.id) return of();
          return this.authService.getUserById(user.id);
        }),
        switchMap((user) => {
          if (user.favorites.includes(recipeId)) {
            user.favorites = user.favorites.filter((id) => id !== recipeId);
          } else {
            user.favorites.push(recipeId);
          }

          return this.authService.updateUser(user, user.id);
        }),
        tap(() => {
          this.recipes$ = this.getRecipeList();
          this.filteredRecipes$ = this.recipes$;
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.recipes$ = this.getRecipeList();
    this.filteredRecipes$ = this.recipes$;
    this.authService.getCurrentUser();
  }
}
