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

  public getUserCountryOrNothing(): Observable<{ country: string }> {
    const params = {fields: 'country'};
    return this.authService.user
      .pipe(mergeMap(user => {
        const userId = user.id;
        return this.http.get<string>(`${environment.url}/user/ip/${userId}`);
      }), mergeMap(ip => {
        return this.http.get<{ country: string }>(`${environment.countryAPI}/${ip}`, {params});
      }));
  }
}
