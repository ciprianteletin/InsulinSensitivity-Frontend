import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {DetailedUserModel} from '../model/representation/detailed-user.model';
import {Observable} from 'rxjs';
import {UtilsService} from '../services/utils.service';
import {AES} from 'crypto-js';
import {environment} from '../constants/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({providedIn: 'root'})
export class DetailedUserResolver implements Resolve<DetailedUserModel> {
  constructor(private utilService: UtilsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<DetailedUserModel> | Promise<DetailedUserModel> | DetailedUserModel {
    const username = route.queryParams.username;
    if (!username) {
      return null;
    }
    const decryptedUsername = AES.decrypt(username, environment.secretKey).toString(CryptoJS.enc.Utf8);
    return this.utilService.getDetailedUser(decryptedUsername);
  }
}
