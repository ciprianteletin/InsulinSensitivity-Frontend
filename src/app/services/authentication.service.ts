import {Injectable} from '@angular/core';
import {NgForm} from '@angular/forms';
import {RegisterBasicModel} from '../model/register-basic.model';
import {CompleteUserModel} from '../model/complete-user.model';
import {Observable} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../constants/environment';
import {GenericResponseModel} from '../model/generic-response.model';
import {UserModel} from '../model/user.model';

/**
 * Service that tackles every request/operation related to the authentication process. It returns an Observable, letting
 * the component decide what to do next in case of failure/success. Uses as mechanism to communicate with other services/component
 * an BehaviourSubject, witch pass the last value emitted. If the user logged before the subscription, the service/comp. calling
 * for the actual user will receive it's data.
 */
@Injectable({providedIn: 'root'})
export class AuthenticationService {
  constructor(private http: HttpClient) {
  }

  buildUserFromFormValues(form: NgForm, basicUser: RegisterBasicModel): CompleteUserModel {
    return {
      username: basicUser.username,
      password: basicUser.password,
      email: basicUser.email,
      role: form.value.medic ? 'medic' : 'patient',
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      phoneNr: form.value.phone,
      gender: form.value.gender,
      age: +form.value.age
    };
  }

  /**
   * Method which calls the backend register process. Returns a generic HttpResponse object created for methods that
   * only needs to announce us if the operation was realized with success.
   */
  registerCompleteUser(completeUser: CompleteUserModel): Observable<GenericResponseModel> {
    return this.http.post<GenericResponseModel>(`${environment.url}/register`, completeUser);
  }

  /**
   * Method to call login endpoint. By using {observe: response} as a configuration, we are sure that we will receive
   * the entire http response, including the header where the token resides, which can be later manipulated
   * from an interceptor and added to every request, if the user is logged, of course.
   */
  login(user: UserModel): Observable<HttpResponse<any>> {
    return this.http.post(`${environment.url}/login`, user, {observe: 'response'});
  }

  /**
   * Clear the local storage where the token resides.
   */
  logout(): void {
    localStorage.clear();
  }
}
