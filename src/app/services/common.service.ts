import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../models/recipe-models';
import { environment } from 'src/environments/environment';
import { Observable, map, switchMap, take, tap } from 'rxjs';
import { NewId } from '../models/auth-models';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private http: HttpClient) {}

  getRecipeList(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${environment.jsonServerBase}/recipes`);
  }

  getIds(): Observable<NewId> {
    return this.http.get<NewId>(`${environment.jsonServerBase}/newIds`);
  }

  updateIds(ids: NewId) {
    return this.http.put<NewId>(`${environment.jsonServerBase}/newIds`, ids);
  }

  postNewRecipe(recipe: Recipe) {
    let newId: NewId | undefined;
    this.getIds()
      .pipe(
        take(1),
        switchMap((id) => {
          newId = { id: id.id + 1 };

          recipe.recipeId = id.id;
          return this.http.post<FormData>(
            `${environment.jsonServerBase}/recipes`,
            recipe
          );
        }),
        tap(() => {
          if (newId) {
            this.updateIds(newId);
          }
        })
      )
      .subscribe(() => {});
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
