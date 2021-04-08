import {FormControl, ValidationErrors} from '@angular/forms';
import {FormlyFieldConfig} from '@ngx-formly/core';

export function isNumber(control: FormControl): ValidationErrors {
  return control.value && /^\d+$/.test(control.value) ? null : {onlyNumber: true};
}

export function numberMessage(err, field: FormlyFieldConfig): string {
  return !field.formControl.value ? 'empty field not allowed!' :
    `${field.formControl.value} is not a number!`;
}

export function isPositive(control: FormControl): ValidationErrors {
  return !control.value && isNaN(control.value) && control.value > 0 ? null : {isPositive: true};
}
