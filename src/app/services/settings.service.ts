import {Injectable} from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../constants/environment';
import {mergeMap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class SettingsService {
  constructor(private authService: AuthenticationService,
              private http: HttpClient) {
  }

  public getUserCountryOrNothing(id: number): Observable<{ country: string }> {
    const params = {fields: 'country'};
    return this.http.get(`${environment.url}/user/ip/${id}`, {responseType: 'text'})
      .pipe(
        mergeMap(ip => {
          const userIp = ip === '127.0.0.1' ? '79.118.48.107' : ip;
          return this.http.get<{ country: string }>(`${environment.countryAPI}/${userIp}`, {params, withCredentials: false});
        }));
  }
}
