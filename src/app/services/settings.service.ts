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
  private readonly accountGeneral = 'accountGeneral';
  private readonly accountInfo = 'accountInfo';

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
      switch (property) {
        case this.accountGeneral:
        case this.accountInfo:
          const formGeneral = formMap[this.accountGeneral].value;
          const formInfo = formMap[this.accountInfo].value;
          const updateInfo = {
            username: formGeneral.username,
            email: formGeneral.email,
            phoneNr: formInfo.phone
          };
          this.http.put(`${environment.url}/user/updateInformation/${detailedUser.id}`, updateInfo)
            .subscribe(() => {
              if (detailedUser.username !== formGeneral.username) {
                this.emitUserIfDifferent(detailedUser, formGeneral.username);
                this.updateCacheIfAvailable(detailedUser.username, formGeneral.username);
                this.changeQueryParams(formGeneral.username);
              }
            });
          break;
        case 'accountPassword':

          break;
      }
      return;
    }
  }

  private emitUserIfDifferent(detailedUser: DetailedUserModel, updatedUsername: string): void {
    this.authService.emitNewUser({
      id: detailedUser.id,
      username: updatedUsername,
    });
    this.authService.getNewToken();
  }

  private updateCacheIfAvailable(username: string, updatedUsername: string): void {
    const country = this.cacheService.getItem(username);
    this.cacheService.removeItem(username);
    this.cacheService.saveItem(updatedUsername, country);
  }

  private changeQueryParams(updatedUsername: string): void {
    const encryptedUsername = AES.encrypt(updatedUsername, environment.secretKey).toString();
    this.router.navigate(['/settings', {username: encryptedUsername}]);
  }
}
