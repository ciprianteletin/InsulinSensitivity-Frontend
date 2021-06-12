import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[appDecimalsNumbers]'
})
export class DecimalNumbersDirective {
  @HostListener('keypress', ['$event']) checkOnlyNumbers(event): boolean {
    const charCode = event.key.charCodeAt(0);
    const stringValue = event.target.value;
    if ((stringValue.includes('.') || stringValue === '') && charCode === 46) {
      return false;
    }

    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      event.stopPropagation();
      return false;
    }
    return true;
  }
}
