import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]'
})
export class OnlyNumbersDirective {
  @HostListener('keypress', ['$event']) checkOnlyNumbers(event): boolean {
    const charCode = event.key.charCodeAt(0);
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.stopPropagation();
      return false;
    }
    return true;
  }
}
