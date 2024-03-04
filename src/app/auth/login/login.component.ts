import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LogInForm } from 'src/app/models/form-models';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  isSubmitted: boolean = false;
  form: FormGroup = this.buildForm();

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  private buildForm() {
    return this.fb.group<LogInForm>({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required]),
    });
  }

  login() {
    this.isSubmitted = true;
    if (this.form.valid) {
      const email: string = this.form.controls['email'].value;
      const password: string = this.form.controls['password'].value;

      console.log('inside component');

      this.authService.logInUser(email, password);
    }
  }
}
