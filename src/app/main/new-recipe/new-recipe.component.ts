import {
  Component,
  ElementRef,
  Inject,
  Optional,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  Ingredient,
  Recipe,
  RecipeEdit,
  RecipeSubmission,
  Unit,
  recipeAdditionalDetails,
} from 'src/app/models/recipe-models';
import { IngredientsForm, NewRecipeForm } from 'src/app/models/form-models';
import { CommonService } from 'src/app/services/common.service';
import { switchMap, take, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/auth-models';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-recipe',
  templateUrl: './new-recipe.component.html',
  styleUrls: ['./new-recipe.component.scss'],
})
export class NewRecipeComponent {
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private authService: AuthService,
    private router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: Recipe
  ) {}

  userId?: number = this.authService.currentUserId;

  isSubmitted: boolean = false;
  form: FormGroup = this.buildForm();
  units: string[] = Object.values(Unit);

  chosenFileName?: string;
  @ViewChild('fileUpload')
  fileUpload?: ElementRef;

  recipeAdditionalDetails: recipeAdditionalDetails | undefined;

  private buildForm() {
    return this.fb.group<NewRecipeForm>({
      title: this.fb.control('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z ]+$'),
      ]),
      description: this.fb.control('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      instruction: this.fb.control('', [Validators.required]),
      ingredients: this.fb.array([
        this.fb.group<IngredientsForm>({
          quantity: this.fb.control(null, [
            Validators.required,
            Validators.min(0),
          ]),
          unit: this.fb.control(null, [Validators.required]),
          product: this.fb.control('', [
            Validators.required,
            Validators.pattern('^[a-zA-Z ]+$'),
          ]),
        }),
      ]),
      img: this.fb.control(['']),
    });
  }

  getIngredientsControls(): AbstractControl[] {
    return (this.form.get('ingredients') as FormArray)?.controls || [];
  }

  addIngredientControl() {
    if (this.form.controls['ingredients'] instanceof FormArray) {
      const ingredients = this.form.controls['ingredients'];
      ingredients?.push(
        this.fb.group<IngredientsForm>({
          quantity: this.fb.control(null, [
            Validators.required,
            Validators.min(0),
          ]),
          unit: this.fb.control(null, [Validators.required]),
          product: this.fb.control('', [
            Validators.required,
            Validators.pattern('^[a-zA-Z ]+$'),
          ]),
        })
      );
    }
  }

  removeIngredientControl(index: number) {
    if (this.form.controls['ingredients'] instanceof FormArray) {
      const ingredients = this.form.controls['ingredients'];
      ingredients?.removeAt(index);
    }
  }

  onImageUpload(e: Event) {
    const event = e.target as HTMLInputElement;
    if (event.files && event.files.length > 0) {
      this.chosenFileName = event?.['files'][0].name;
      let imgFile: File | null = event.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const imgControl = this.form.get('img');
        if (imgControl) {
          imgControl.setValue(reader.result as string);
        }
      };
      reader.readAsDataURL(imgFile);
    }
  }

  clickFileUpload() {
    if (this.fileUpload) this.fileUpload.nativeElement.click();
  }

  removeBtnDisabled(): boolean {
    if (this.form.controls['ingredients'] instanceof FormArray) {
      return this.form.controls['ingredients'].length === 1;
    }
    return false;
  }

  addNewRecipe(event: Event) {
    event.preventDefault();
    this.isSubmitted = true;
    const userId: number | undefined = this.userId;

    if (this.form.valid && userId) {
      const newRecipe: RecipeSubmission = {
        title: this.form.controls['title'].value,
        description: this.form.controls['description'].value,
        instruction: this.form.controls['instruction'].value,
        ingredients: [],
        img: this.form.controls['img'].value,
        authorId: userId,
      };

      (this.form.controls['ingredients'] as FormArray).controls.forEach(
        (control) =>
          newRecipe.ingredients.push({
            quantity: (control as FormGroup).controls['quantity'].value,
            unit: (control as FormGroup).controls['unit'].value,
            product: (control as FormGroup).controls['product'].value,
          })
      );

      let recipeId: number | undefined;

      // SUBMISSION USING FORM DATA
      // const formData: FormData = new FormData();
      // const authorId: string = userId.toString();
      // formData.append('authorId', authorId);
      // for (let controlName in this.form.controls) {
      //    formData.append(controlName, this.form.controls[controlName].value);
      // }

      this.commonService
        .postNewRecipe(newRecipe)
        .pipe(
          take(1),
          switchMap((recipe) => {
            recipeId = recipe.id;
            return this.authService.getUserById(userId);
          }),
          switchMap((user) => {
            if (recipeId) {
              user.recipeIds.push(recipeId);
            }
            return this.authService.updateUser(user, user.id);
          }),
          tap(() => this.router.navigate(['']))
        )
        .subscribe();
    }
  }

  ngOnInit() {
    if (this.data) {
      this.recipeAdditionalDetails = {
        authorId: this.data.authorId,
        recipeId: this.data.id,
      };
      const createIngredientFormGroup = (ingredient: Ingredient): FormGroup => {
        return this.fb.group({
          quantity: [
            ingredient.quantity,
            [Validators.required, Validators.min(0)],
          ],
          unit: [ingredient.unit, Validators.required],
          product: [
            ingredient.product,
            [
              Validators.required,
              Validators.pattern('^[a-zA-Z ]+$'), // Assuming ingredients can have spaces
            ],
          ],
        });
      };

      const rebuildIngredientsFormArray = (ingredients: Ingredient[]): void => {
        const ingredientsFormArray = this.form.get('ingredients') as FormArray;
        ingredientsFormArray.clear();

        ingredients.forEach((ingredient) => {
          ingredientsFormArray.push(createIngredientFormGroup(ingredient));
        });
      };

      this.form.patchValue({
        title: this.data.title,
        description: this.data.description,
        instruction: this.data.instruction,
        img: this.data.img,
      });

      rebuildIngredientsFormArray(this.data.ingredients);
    }
  }
}
