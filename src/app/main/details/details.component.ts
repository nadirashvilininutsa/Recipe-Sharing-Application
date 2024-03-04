import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Recipe } from 'src/app/models/recipe-models';
import { NewRecipeComponent } from '../new-recipe/new-recipe.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  constructor(public dialog: MatDialog) {}

  @Input() recipeDetails: Recipe | undefined;
  @Output() hideDetails = new EventEmitter();

  navigateToRecipeList() {
    this.hideDetails.emit();
  }

  openDialog(recipe: Recipe) {
    const dialogRef = this.dialog.open(NewRecipeComponent, {
      data: recipe,
      panelClass: 'recipe-dialog',
    });

    dialogRef
      .afterClosed()
      .subscribe((result) => console.log('Dialog result is: ', result));
  }
}
