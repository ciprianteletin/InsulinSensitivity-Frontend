import {Injectable} from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../constants/environment';
import {mergeMap} from 'rxjs/operators';
import {CacheService} from './cache.service';
import {CustomFormMap} from '../model/custom-form-map.model';
import {DetailedUserModel} from '../model/detailed-user.model';
import {AES, SHA3} from 'crypto-js';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class SettingsService {
  constructor(private authService: AuthenticationService,
              private http: HttpClient,
              private cacheService: CacheService,
              private router: Router) {
  }

  public getUserCountryOrNothing(username: string): Observable<{ country: string }> {
    username = SHA3(username).toString();
    if (this.cacheService.checkIfPresent(username)) {
      return of({country: this.cacheService.getItem(username)});
    }
    const params = {fields: 'country'};
    return this.http.get(`${environment.url}/user/ip`, {responseType: 'text'})
      .pipe(
        mergeMap(ip => {
          const userIp = ip === '127.0.0.1' ? '79.118.48.107' : ip;
          return this.http.get<{ country: string }>(`${environment.countryAPI}/${userIp}`, {params, withCredentials: false});
        }));
  }

  public submitActiveForm(property: string, formMap: CustomFormMap, detailedUser: DetailedUserModel): void {
    if (formMap.hasOwnProperty(property)) {
      const formValues = formMap[property].value;
      switch (property) {
        case 'accountGeneral':
        case 'accountInfo':
          const updateInfo = {
            username: formValues.username,
            email: formValues.email,
            phoneNr: formValues.phoneNr
          };
          this.http.put(`${environment.url}/user/updateInformation/${detailedUser.id}`, updateInfo)
            .subscribe(() => {
              this.emitUserIfDifferent(detailedUser.id, detailedUser.username, formValues.username);
              this.changeQueryParams(detailedUser.username, formValues.username);
            });
          break;
        case 'accountPassword':

          break;
      }
      return;
    }
  }

  private emitUserIfDifferent(id: number, username: string, updatedUsername: string): void {
    if (username === updatedUsername) {
      return;
    }
    this.authService.emitNewUser({
      id,
      username: updatedUsername,
    });
  }

  private changeQueryParams(username: string, updatedUsername: string): void {
    if (username === updatedUsername) {
      return;
    }
    const encryptedUsername = AES.encrypt(updatedUsername, environment.secretKey).toString();
    this.router.navigate(['/settings', {username: encryptedUsername}]);
  }
}
