import {Observable} from 'rxjs';

export interface CanLeave {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
