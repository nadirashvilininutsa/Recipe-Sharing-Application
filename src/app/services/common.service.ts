import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe, RecipeKeys, RecipeSubmission } from '../models/recipe-models';
import { environment } from 'src/environments/environment';
import { Observable, map, switchMap, take, tap } from 'rxjs';
import { UserFullInto } from '../models/auth-models';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private http: HttpClient) {}

  getRecipeList(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${environment.jsonServerBase}/recipes`);
  }

  getFilteredRecipes(id: number, filterBy: RecipeKeys) {
    return this.http
      .get<Recipe[]>(`${environment.jsonServerBase}/recipes`)
      .pipe(
        map((recipes) => recipes.filter((recipe) => recipe[filterBy] === id))
      );
  }

  postNewRecipe(recipe: RecipeSubmission): Observable<Recipe> {
    return this.http.post<Recipe>(
      `${environment.jsonServerBase}/recipes`,
      recipe
    );
  }

  updateRecipe(recipe: Recipe, id: number): Observable<Recipe> {
    return this.http.put<Recipe>(
      `${environment.jsonServerBase}/recipes/${id}`,
      recipe
    );
  }

  deleteRecipe(id: number) {
    return this.http.delete<any>(`${environment.jsonServerBase}/recipes/${id}`);
  }
}
