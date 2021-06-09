import {Injectable} from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../constants/environment';
import {catchError, mergeMap} from 'rxjs/operators';
import {CacheService} from './cache.service';
import {CustomFormMap} from '../model/representation/custom-form-map.model';
import {DetailedUserModel} from '../model/representation/detailed-user.model';
import {AES} from 'crypto-js';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UserPasswordModel} from '../model/representation/user-password.model';
import {NotificationType} from '../constants/notification-type.enum';
import {NotificationService} from './notification.service';
import {CookieService} from 'ngx-cookie-service';

@Injectable({providedIn: 'root'})
export class SettingsService {
  private activeElementSubject = new BehaviorSubject<string>('accountGeneral');
  private userImageChanged = new BehaviorSubject<string>(null);
  private readonly accountGeneral = 'accountGeneral';
  private readonly accountInfo = 'accountInfo';
  private readonly accountPassword = 'accountPassword';

  private static buildDate(date: string): string {
    const splitter = date.split('/');
    let newDate: string;
    if (splitter[0].length === 1) {
      newDate = `0${splitter[0]}/`;
    } else {
      newDate = `${splitter[0]}/`;
    }

    if (splitter[1].length === 1) {
      newDate += `0${splitter[1]}/`;
    } else {
      newDate += `${splitter[1]}/`;
    }

    return newDate + splitter[2];
  }

  constructor(private authService: AuthenticationService,
              private http: HttpClient,
              private cacheService: CacheService,
              private router: Router,
              private cookieService: CookieService,
              private activeRoute: ActivatedRoute,
              private notificationService: NotificationService) {
  }

  public emitActiveElement(active: string): void {
    this.activeElementSubject.next(active);
  }

  public getActiveElementSubject(): BehaviorSubject<string> {
    return this.activeElementSubject;
  }

  public getImageChangedSubject(): BehaviorSubject<string> {
    return this.userImageChanged;
  }

  public getUserCountryOrNothing(username: string): Observable<{ country: string }> {
    username = AES.encrypt(username, environment.secretKey).toString();
    if (this.cacheService.checkIfPresent(username)) {
      return of({country: this.cacheService.getItem(username)});
    }
    return this.obtainCountry();
  }

  public submitActiveForm(property: string, selectedFile: File, formMap: CustomFormMap, detailedUser: DetailedUserModel): void {
    if (formMap.hasOwnProperty(property)) {
      switch (property) {
        case this.accountGeneral:
        case this.accountInfo:
          this.onUploadPhoto(selectedFile, detailedUser.id);
          this.updateUserInformation(formMap, detailedUser);
          break;
        case this.accountPassword:
          this.updatePassword(formMap, detailedUser);
          break;
      }
      return;
    }
  }

  public deleteHistoryByDate(fromDate: string, toDate: string): void {
    this.http.delete(`${environment.url}/history/delete`, {
      params: {
        fromDate: SettingsService.buildDate(fromDate),
        toDate: SettingsService.buildDate(toDate)
      }
    })
      .subscribe(() => this.notificationService.notify(NotificationType.SUCCESS, 'History deleted with success!'),
        () => this.notificationService.notify(NotificationType.ERROR, 'Error occurred during history deletion!'));
  }

  public deleteAllHistory(): void {
    this.http.delete(`${environment.url}/history/deleteAll`)
      .subscribe(() => this.notificationService.notify(NotificationType.SUCCESS, 'History deleted with success!'),
        () => this.notificationService.notify(NotificationType.ERROR, 'Error occurred during history deletion!'));
  }

  public deleteUserAccount(id: number): void {
    this.http.delete(`${environment.url}/user/delete/${id}`)
      .subscribe(() => {
        this.authService.logout()
          .subscribe();
        this.notificationService.notify(NotificationType.INFO, 'Account deleted with success');
      });
  }

  private onUploadPhoto(selectedFile: File, id: number): void {
    if (!selectedFile) {
      return;
    }
    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', selectedFile, selectedFile.name);

    this.http.post<DetailedUserModel>(`${environment.url}/user/upload/${id}`, uploadImageData, {observe: 'response'})
      .subscribe((user) => {
        const image = 'data:image/jpeg;base64,' + user.body.details.profileImage;
        this.userImageChanged.next(image);
      });
  }

  private obtainCountry(): Observable<{ country: string }> {
    const params = {fields: 'country'};
    return this.http.get(`${environment.url}/user/ip`, {responseType: 'text'})
      .pipe(
        catchError(() => of('Unknown')),
        mergeMap(ip => {
          const userIp = ip === '127.0.0.1' || ip === '0:0:0:0:0:0:0:1' ? '79.118.48.107' : ip;
          return this.http.get<{ country: string }>(`${environment.countryAPI}/${userIp}`, {params, withCredentials: false});
        }));
  }

  private updateUserInformation(formMap: CustomFormMap, detailedUser: DetailedUserModel): void {
    const updateInfo = this.buildUserInformation(formMap);
    this.http.put(`${environment.url}/user/updateInformation/${detailedUser.id}`, updateInfo)
      .subscribe(() => {
        if (detailedUser.username !== updateInfo.username) {
          this.updateCache(updateInfo.username);
          this.changeQueryParams(updateInfo.username);
          this.emitUserIfDifferent(detailedUser, updateInfo.username);
          this.updateCacheIfAvailable(detailedUser.username, updateInfo.username);
        }
      });
  }

  private updateCache(username: string): void {
    const rememberMe = this.cookieService.check('rememberMe');
    if (rememberMe) {
      username = AES.encrypt(username, environment.secretKey).toString();
      this.cookieService.set('username', username);
    }
  }

  private updatePassword(formMap: CustomFormMap, detailedUser: DetailedUserModel): void {
    const formPassword = formMap[this.accountPassword].value;
    const userPassword: UserPasswordModel = {
      username: detailedUser.username,
      password: formPassword.currentPassword,
      newPassword: formPassword.password
    };
    this.updatePasswordRequest(userPassword);
  }

  private buildUserInformation(formMap: CustomFormMap): { username: string, email: string, phoneNr: string } {
    const formGeneral = formMap[this.accountGeneral].value;
    const formInfo = formMap[this.accountInfo].value;
    return {
      username: formGeneral.username,
      email: formGeneral.email,
      phoneNr: formInfo.phone
    };
  }

  private emitUserIfDifferent(detailedUser: DetailedUserModel, updatedUsername: string): void {
    this.authService.emitNewUser({
      id: detailedUser.id,
      username: updatedUsername,
    });
    this.authService.updateTokenNewDetails(updatedUsername);
  }

  private updateCacheIfAvailable(username: string, updatedUsername: string): void {
    const encryptedUsername = AES.encrypt(username, environment.secretKey).toString();
    const country = this.cacheService.getItem(encryptedUsername);
    this.cacheService.removeItem(encryptedUsername);
    const encryptedUpdate = AES.encrypt(updatedUsername, environment.secretKey).toString();
    this.cacheService.saveItem(encryptedUpdate, country);
  }

  private changeQueryParams(updatedUsername: string): void {
    const encryptedUsername = AES.encrypt(updatedUsername, environment.secretKey).toString();
    const queryParams: Params = {username: encryptedUsername};
    this.router.navigate([], {
      queryParams,
      relativeTo: this.activeRoute,
      replaceUrl: true
    });
  }

  private updatePasswordRequest(userPassword: UserPasswordModel): void {
    this.http.put(`${environment.url}/user/updatePassword`, userPassword)
      .subscribe(() => {
        this.authService.logout()
          .subscribe(() => this.notificationService.notify(NotificationType.SUCCESS, 'Password changed with success!'));
      });
  }
}
