import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
  selector: '[appModal]'
})
export class ModalDirective {
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
    if (event.key === 'Escape' || event.key === 'Esc') {
      this.renderer.addClass(this.fixedElem.nativeElement, 'hidden');
    }
  }

  constructor(private fixedElem: ElementRef,
              private renderer: Renderer2) {
  }
}
