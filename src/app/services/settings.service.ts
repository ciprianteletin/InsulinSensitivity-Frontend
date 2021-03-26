import {Injectable} from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../constants/environment';
import {mergeMap} from 'rxjs/operators';
import {CacheService} from './cache.service';

@Injectable({providedIn: 'root'})
export class SettingsService {
  constructor(private authService: AuthenticationService,
              private http: HttpClient,
              private cacheService: CacheService) {
  }

  public getUserCountryOrNothing(username: string): Observable<{ country: string }> {
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
}
