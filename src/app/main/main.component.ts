import { Component } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Recipe } from '../models/api-models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  constructor(private commonService: CommonService) {}

  recipes$: Observable<Recipe[]> | undefined;
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

  ngOnInit() {
    this.recipes$ = this.getRecipeList();
  }
}
