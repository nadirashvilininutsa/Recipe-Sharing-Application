import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  Recipe,
  RecipeEdit,
  RecipeSubmission,
} from 'src/app/models/recipe-models';
import { AuthService } from 'src/app/services/auth.service';
import { NewRecipeComponent } from '../new-recipe/new-recipe.component';
import { CommonService } from 'src/app/services/common.service';
import { BehaviorSubject, first, map, of, switchMap, take, tap } from 'rxjs';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { UserFullInto } from 'src/app/models/auth-models';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent {
  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private commonService: CommonService
  ) {}

  // userId?: number = this.authService.currentUserId;
  currentUser$: BehaviorSubject<UserFullInto | undefined> =
    this.authService.currentUserInfo$;

  favorite: boolean = false;

  @Input() recipe: Recipe | undefined;
  @Output() displayDetails = new EventEmitter<Recipe>();
  @Output() recipeDeleted = new EventEmitter<Recipe>();
  @Output() addToFavorites = new EventEmitter<number>();
  @Output() recipeEdit = new EventEmitter<RecipeEdit>();

  displayRecipeDetails() {
    this.displayDetails.emit(this.recipe);
  }

  openEdit(recipe: Recipe) {
    const dialogRef = this.dialog.open(NewRecipeComponent, {
      data: recipe,
      panelClass: 'recipe-dialog',
    });

    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        tap((result) => {
          if (result) {
            this.recipeEdit.emit(result);
          }
        })
      )
      .subscribe();
  }

  openDelete() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      panelClass: 'recipe-dialog',
    });

    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        tap((result) => {
          if (result) this.recipeDeleted.emit(this.recipe);
        })
      )
      .subscribe();
  }

  addToFavorite() {
    const recipeId: number | undefined = this.recipe?.id;
    if (recipeId) {
      this.addToFavorites.emit(recipeId);
    }
  }

  ngOnInit() {
    this.currentUser$
      .pipe(
        first(),
        take(1),
        tap((user) => {
          const recipeId = this.recipe?.id;
          if (recipeId && user && user.favorites.includes(recipeId)) {
            this.favorite = true;
          }
        })
      )
      .subscribe();
  }
}
