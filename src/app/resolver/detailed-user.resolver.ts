import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {DetailedUserModel} from '../model/detailed-user.model';
import {Observable} from 'rxjs';
import {UtilsService} from '../services/utils.service';

@Injectable({providedIn: 'root'})
export class DetailedUserResolver implements Resolve<DetailedUserModel> {
  constructor(private utilService: UtilsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<DetailedUserModel> | Promise<DetailedUserModel> | DetailedUserModel {
    const id = +route.paramMap.get('userId');
    return this.utilService.getDetailedUser(id);
  }
}
