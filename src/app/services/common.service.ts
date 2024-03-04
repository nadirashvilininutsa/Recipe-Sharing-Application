import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../models/recipe-models';
import { environment } from 'src/environments/environment';
import { Observable, map, switchMap, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private http: HttpClient) {}

  getRecipeList(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${environment.jsonServerBase}/recipes`);
  }

  // getRecipeId(): Observable<NewId> {
  //   return this.http.get<NewId>(`${environment.jsonServerBase}/newRecipeId`);
  // }

  // updateRecipeId(ids: NewId) {
  //   return this.http.put<NewId>(
  //     `${environment.jsonServerBase}/newRecipeId`,
  //     ids
  //   );
  // }

  postNewRecipe(recipe: FormData) {
    // let newId: NewId | undefined;
    // this.getRecipeId()
    //   .pipe(
    //     take(1),
    //     switchMap((id) => {
    //       const recipeId: string | undefined = id.id.toString();
    //       newId = { id: id.id + 1 };
    //       recipe.append('recipeId', recipeId);
    //       return this.http.post<FormData>(
    //         `${environment.jsonServerBase}/recipes`,
    //         recipe
    //       );
    //     }),
    //     tap(() => {
    //       if (newId) {
    //         this.updateRecipeId(newId);
    //       }
    //     })
    //   )
    //   .subscribe(() => {});
  }
}
