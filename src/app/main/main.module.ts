import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { ReceiptComponent } from './receipt/receipt.component';
import { DetailsComponent } from './details/details.component';
import { NewReceiptComponent } from './new-receipt/new-receipt.component';
import { RecipeComponent } from './recipe/recipe.component';
import { NewRecipeComponent } from './new-recipe/new-recipe.component';



@NgModule({
  declarations: [
    MainComponent,
    ReceiptComponent,
    DetailsComponent,
    NewReceiptComponent,
    RecipeComponent,
    NewRecipeComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MainModule { }
