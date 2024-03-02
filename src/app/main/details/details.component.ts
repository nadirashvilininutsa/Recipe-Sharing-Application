import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Recipe } from 'src/app/models/recipe-models';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  @Input() recipeDetails: Recipe | undefined;
  @Output() hideDetails = new EventEmitter();

  navigateToRecipeList() {
    this.hideDetails.emit();
  }
}
