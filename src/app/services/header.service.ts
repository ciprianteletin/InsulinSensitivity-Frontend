import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class HeaderService {
  private activateSidebar = new Subject<void>();

  changeValue(): void {
    this.activateSidebar.next();
  }

  getSidebarEvent(): Subject<void> {
    return this.activateSidebar;
  }
}
