import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NewIds, Recipe } from '../models/recipe-models';
import { environment } from 'src/environments/environment';
import { Observable, map, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private http: HttpClient) {}

  getRecipeList(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${environment.jsonServerBase}/recipes`);
  }

  getIds(): Observable<NewIds> {
    return this.http.get<NewIds>(`${environment.jsonServerBase}/newIds`);
  }

  updateIds(ids: NewIds) {
    return this.http.put<NewIds>(`${environment.jsonServerBase}/newIds`, ids);
  }

  postNewRecipe(recipe: Recipe) {
    let ids: NewIds | undefined;
    this.getIds()
      .pipe(
        take(1),
        tap((receivedIds) => (ids = receivedIds))
      )
      .subscribe(() => {
        if (ids?.newRecipeId && ids?.newUserId) {
          recipe.recipeId = ids.newRecipeId;
          recipe.authorId = 55;

          ids.newRecipeId += 1;

          this.http
            .post<FormData>(`${environment.jsonServerBase}/recipes`, recipe)
            .pipe(
              tap(() => {
                if (ids) {
                  this.updateIds(ids);
                }
              })
            )
            .pipe(take(1))
            .subscribe();
        }
      });
  }
  // postNewRecipe(recipe: FormData) {
  //   let ids: NewIds | undefined;
  //   this.getIds()
  //     .pipe(
  //       take(1),
  //       tap((receivedIds) => (ids = receivedIds))
  //     )
  //     .subscribe(() => {
  //       if (ids?.newRecipeId && ids?.newUserId) {
  //         recipe.append('recipeId', ids.newRecipeId.toString());

  //         ids.newRecipeId += 1;
  //         console.log(ids.newRecipeId, ids.newUserId);

  //         this.http
  //           .post<FormData>(`${environment.jsonServerBase}/recipes`, recipe)
  //           .pipe(
  //             tap(() => {
  //               if (ids) {
  //                 this.updateIds(ids);
  //               }
  //             })
  //           )
  //           .pipe(take(1))
  //           .subscribe();
  //       }
  //     });
  // }
}
