import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {SettingsService} from '../services/settings.service';
import {AES} from 'crypto-js';
import {environment} from '../constants/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({providedIn: 'root'})
export class CountryResolver implements Resolve<{ country: string }> {
  constructor(private settingService: SettingsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<{ country: string }> | Promise<{ country: string }> | { country: string } {
    const username = route.queryParams.username;
    const decryptedUsername = AES.decrypt(username, environment.secretKey).toString(CryptoJS.enc.Utf8);
    return this.settingService.getUserCountryOrNothing(decryptedUsername);
  }

}
