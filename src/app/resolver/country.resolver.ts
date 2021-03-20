import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {SettingsService} from '../services/settings.service';

@Injectable({providedIn: 'root'})
export class CountryResolver implements Resolve<{ country: string }> {

  constructor(private settingService: SettingsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<{ country: string }> | Promise<{ country: string }> | { country: string } {
    const userId = +route.paramMap.get('userId');
    return this.settingService.getUserCountryOrNothing(userId);
  }

}
