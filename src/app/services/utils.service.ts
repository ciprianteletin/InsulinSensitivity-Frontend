import {ElementRef, Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class UtilsService {
  resetDate = new Subject<void>();

  constructor() {
  }

  public getActiveElementId(list: ElementRef[]): string {
    const elem = list.find(el => el.nativeElement.classList.contains('active'));
    if (elem) {
      return elem.nativeElement.id;
    }
    return undefined;
  }

  onResetDate(): void {
    this.resetDate.next();
  }
}
