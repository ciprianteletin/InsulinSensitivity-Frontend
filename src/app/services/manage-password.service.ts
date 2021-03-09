import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GenericResponseModel} from '../model/generic-response.model';
import {environment} from '../constants/environment';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ManagePasswordService {
  constructor(private http: HttpClient) {
  }

  resetPassword(password: string, code: string): Observable<GenericResponseModel> {
    return this.http.get<GenericResponseModel>(`${environment.url}/resetPassword/${code}/${password}`);
  }

  sendEmail(email: string): Observable<GenericResponseModel> {
    return this.http.get<GenericResponseModel>(`${environment.url}/forgotPassword/${email}`);
  }
}
