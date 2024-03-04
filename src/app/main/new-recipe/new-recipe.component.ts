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
import { Ingredient, Recipe, Unit } from 'src/app/models/recipe-models';
import { IngredientsForm, NewRecipeForm } from 'src/app/models/form-models';
import { CommonService } from 'src/app/services/common.service';
import { switchMap, take, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/auth-models';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: Recipe
  ) {}

  isSubmitted: boolean = false;
  form: FormGroup = this.buildForm();
  units: string[] = Object.values(Unit);

  chosenFileName?: string;
  @ViewChild('fileUpload')
  fileUpload?: ElementRef;

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
          quantity: this.fb.control(null, [Validators.required]),
          unit: this.fb.control(null, [Validators.required]),
          product: this.fb.control('', [
            Validators.required,
            Validators.pattern('^[a-zA-Z]+$'),
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
          quantity: this.fb.control(null, [Validators.required]),
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

  removeBtnDisabled(): boolean {
    if (this.form.controls['ingredients'] instanceof FormArray) {
      return this.form.controls['ingredients'].length === 1;
    }
    return false;
  }

  addNewRecipe(event: Event) {
    event.preventDefault();
    // this.isSubmitted = true;
    // console.log(this.form);
    // if (this.form.valid) {
    //   console.log('Form is valid');
    //   const formData: FormData = new FormData();
    //   for (let controlName in this.form.controls) {
    //     formData.append(controlName, this.form.controls[controlName].value);
    //   }
    //   let authorId: string | undefined =
    //     this.authService.currentUserId?.toString();
    //   if (authorId) {
    //     formData.append('authorId', authorId);
    //   }
    //   this.commonService.postNewRecipe(formData);
    // }
  }

  clickFileUpload() {
    if (this.fileUpload) this.fileUpload.nativeElement.click();
  }

  ngOnInit() {
    if (this.data) {
      const createIngredientFormGroup = (ingredient: Ingredient): FormGroup => {
        return this.fb.group({
          quantity: [ingredient.quantity, Validators.required],
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
