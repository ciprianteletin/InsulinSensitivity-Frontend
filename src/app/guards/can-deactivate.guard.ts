import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {CanLeave} from './utils/can.leave';
import {Observable} from 'rxjs';

/**
 * Can deactivate guards let the user to leave the page if the return value is true.
 * By using as a type the interface CanLeaveInterface, we let the component decide
 * what to do before letting the user to leave.
 */
@Injectable({providedIn: 'root'})
export class CanDeactivateGuard implements CanDeactivate<CanLeave> {

  canDeactivate(component: CanLeave, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return component.canDeactivate();
  }
}
