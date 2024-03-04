import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Recipe } from 'src/app/models/recipe-models';
import { NewRecipeComponent } from '../new-recipe/new-recipe.component';
import { UserFullInto } from 'src/app/models/auth-models';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, map, switchMap, take, tap } from 'rxjs';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private commonService: CommonService
  ) {}

  // currentUser$: Observable<UserFullInto | undefined> =
  //   this.authService.currentUserInfo$;
  userId?: number = this.authService.currentUserId;

  @Input() recipeDetails: Recipe | undefined;
  @Output() hideDetails = new EventEmitter();
  @Output() recipeDeleted = new EventEmitter<Recipe>();

  navigateToRecipeList() {
    this.hideDetails.emit();
  }

  openDialog(recipe: Recipe) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      panelClass: 'recipe-dialog',
    });

    // result-ში მოვა true როცა დავაჭერთ update ღილაკს
    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        tap((result) => {
          if (result) this.recipeDeleted.emit(this.recipeDetails);
        })
      )
      .subscribe();
  }
}
