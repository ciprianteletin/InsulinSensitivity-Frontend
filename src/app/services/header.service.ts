import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class HeaderService {
  private activateSidebar = new Subject<void>();
  private modifyState = new BehaviorSubject<boolean>(true);

  changeSidebarValue(): void {
    this.activateSidebar.next();
  }

  changeHeaderState(status: boolean): void {
    this.modifyState.next(status);
  }

  getHeaderEvent(): Subject<boolean> {
    return this.modifyState;
  }

  getSidebarEvent(): Subject<void> {
    return this.activateSidebar;
  }
}
