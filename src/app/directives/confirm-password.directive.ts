import {Attribute, Directive} from '@angular/core';
import {FormControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';

@Directive({
  selector: '[appPasswordValidator]',
  providers: [
    {provide: NG_VALIDATORS, useClass: ConfirmPasswordValidator, multi: true}
  ]
})
export class ConfirmPasswordValidator implements Validator {
  constructor(@Attribute('appPasswordValidator') private passwordControl: string) {
  }

  validate(control: FormControl): ValidationErrors | null {
    const password = control.root.get(this.passwordControl);
    const confirmPass = control.value;
    if (confirmPass === null) {
      return null;
    }
    if (password) {
      const subscription = password.valueChanges.subscribe(() => {
        control.updateValueAndValidity();
        subscription.unsubscribe();
      });
    }
    return password && password.value !== confirmPass ? {passwordMatchError: true} : null;
  }
}
