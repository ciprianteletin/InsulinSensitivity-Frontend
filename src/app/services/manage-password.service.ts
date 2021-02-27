import {Injectable} from '@angular/core';
import {UserModel} from '../model/user.model';
import {HttpClient} from '@angular/common/http';
import {GenericResponseModel} from '../model/generic-response.model';
import {environment} from '../constants/environment';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ManagePasswordService {
  constructor(private http: HttpClient) {
  }

  resetPassword(user: UserModel): Observable<GenericResponseModel> {
    return this.http.post<GenericResponseModel>(`${environment.url}/resetPassword`, user);
  }

  sendEmail(email: string): Observable<GenericResponseModel> {
    return this.http.get<GenericResponseModel>(`${environment.url}/forgetPassword`);
  }
}
