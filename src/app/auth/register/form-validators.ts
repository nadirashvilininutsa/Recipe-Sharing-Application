import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordsMatchValidator(passwordControl: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.root.get(passwordControl)?.value;
    const matchingPassword = control.value;
    if (password && password !== matchingPassword) {
      return { passwordMismatch: true };
    } else {
      return null;
    }
  };
}
