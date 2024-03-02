import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Recipe, Unit } from 'src/app/models/recipe-models';
import { IngredientsForm, NewRecipeForm } from 'src/app/models/form-models';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-new-recipe',
  templateUrl: './new-recipe.component.html',
  styleUrls: ['./new-recipe.component.scss'],
})
export class NewRecipeComponent {
  constructor(private fb: FormBuilder, private commonService: CommonService) {}

  isSubmitted: boolean = false;
  form: FormGroup = this.buildForm();
  units: string[] = Object.values(Unit);

  private buildForm() {
    return this.fb.group<NewRecipeForm>({
      title: this.fb.control('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]+$'),
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
          ingredient: this.fb.control('', [
            Validators.required,
            Validators.pattern('^[a-zA-Z]+$'),
          ]),
        }),
      ]),
      image: this.fb.control(['']),
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
          ingredient: this.fb.control('', [
            Validators.required,
            Validators.pattern('^[a-zA-Z]+$'),
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

  // imageFile: File | null = null;
  // imageBase64: string | null = null;
  onImageUpload(e: Event) {
    const event = e.target as HTMLInputElement;
    if (event.files && event.files.length > 0) {
      let imageFile: File | null = event.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const imageControl = this.form.get('image');
        if (imageControl) {
          imageControl.setValue(reader.result as string);
        }
      };
      reader.readAsDataURL(imageFile);
    }
  }

  removeBtnDisabled(): boolean {
    if (this.form.controls['ingredients'] instanceof FormArray) {
      return this.form.controls['ingredients'].length === 1;
    }
    return false;
  }

  addNewRecipe() {
    this.isSubmitted = true;
    console.log(this.form);

    if (this.form.valid) {
      console.log('Form is valid');

      const formData: FormData = new FormData();

      for (let controlName in this.form.controls) {
        formData.append(controlName, this.form.controls[controlName].value);
      }

      // if (this.imageFile) {
      //   formData.append('image', this.imageFile);
      // }
      formData.append('authorId', 'bla');
      // this.commonService.postNewRecipe(formData);
    }
  }

  ngOnInit() {
    let test: Recipe = {
      title: 'test',
      description: 'test',
      instruction: 'test',
      img: '',
      ingredients: [
        {
          quantity: 1,
          unit: Unit.kg,
          product: 'test',
        },
      ],
      recipeId: 1,
      authorId: 1,
    };
    this.commonService.postNewRecipe(test);
    // console.log('from service');
    // this.commonService.getIds().subscribe();
    // this.commonService
    //   .updateIds({ newRecipeId: 14, newUserId: 11 })
    //   .subscribe();
  }
}
