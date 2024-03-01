import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { DetailsComponent } from './details/details.component';
import { RecipeComponent } from './recipe/recipe.component';
import { NewRecipeComponent } from './new-recipe/new-recipe.component';

@NgModule({
  declarations: [
    MainComponent,
    DetailsComponent,
    RecipeComponent,
    NewRecipeComponent,
  ],
  imports: [CommonModule],
})
export class MainModule {}
