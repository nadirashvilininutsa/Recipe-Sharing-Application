import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Recipe } from 'src/app/models/recipe-models';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent {
  @Input() recipe: Recipe | undefined;
  @Output() displayDetails = new EventEmitter<Recipe>();

  displayRecipeDetails() {
    this.displayDetails.emit(this.recipe);
  }
}
