import { Component } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Recipe } from '../models/recipe-models';
import { Observable, debounceTime, distinctUntilChanged, map, of } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchRecipeForm } from '../models/form-models';
import { AuthService } from '../services/auth.service';

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

  recipes$: Observable<Recipe[]> = of();
  filteredRecipes$: Observable<Recipe[]> = of();
  recipeDetails: Recipe | undefined;

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

  ngOnInit() {
    this.recipes$ = this.getRecipeList();
    this.filteredRecipes$ = this.recipes$;
    this.authService.getCurrentUser();
  }
}
