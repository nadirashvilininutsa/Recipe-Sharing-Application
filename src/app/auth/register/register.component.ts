import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterForm } from 'src/app/models/form-models';
import { passwordsMatchValidator } from './form-validators';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterUser } from 'src/app/models/auth-models';
import { take, tap } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  isSubmitted: boolean = false;
  form: FormGroup = this.buildForm();

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  private buildForm() {
    return this.fb.group<RegisterForm>({
      firstName: this.fb.control('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]+$'),
      ]),
      lastName: this.fb.control('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]+$'),
      ]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*?])[a-zA-Z0-9!@#$%^&*?]+$/
        ),
      ]),
      confirmPassword: this.fb.control('', [
        Validators.required,
        passwordsMatchValidator('password'),
      ]),
    });
  }

  register() {
    this.isSubmitted = true;

    if (this.form.valid) {
      console.log('form is valid');
      this.authService
        .getUserId()
        .pipe(
          take(1),
          tap((userId) => {
            const id: number = userId.id;

            console.log('ID is: ', id);

            const user: RegisterUser = {
              email: this.form.controls['email'].value,
              password: this.form.controls['password'].value,
              details: {
                id: id,
                firstName: this.form.controls['firstName'].value,
                lastName: this.form.controls['lastName'].value,
              },
            };

            this.authService.registerUser(user);
          })
        )
        .subscribe();
    }
  }
}
