import {Injectable} from '@angular/core';
import {NgForm} from '@angular/forms';
import {RegisterBasicModel} from '../model/register-basic.model';
import {CompleteUserModel} from '../model/complete-user.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../constants/environment';
import {GenericResponseModel} from '../model/generic-response.model';
import {UserModel} from '../model/user.model';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';

/**
 * Service that tackles every request/operation related to the authentication process. It returns an Observable, letting
 * the component decide what to do next in case of failure/success. Uses as mechanism to communicate with other services/component
 * an BehaviourSubject, witch pass the last value emitted. If the user logged before the subscription, the service/comp. calling
 * for the actual user will receive it's data.
 */
@Injectable({providedIn: 'root'})
export class AuthenticationService {
  user = new BehaviorSubject(null);
  timerRefreshToken: any;

  constructor(private http: HttpClient,
              private router: Router) {
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
    return this.http.post(`${environment.url}/login`, user, {observe: 'response'})
      .pipe(tap(response => this.handleAuth(response)));
  }

  /**
   * Clear all trace of the logged user and send a request to the server to delete related metaData in case of
   * manual log-out. Also redirect the user to the main page
   */
  logout(): void {
    this.user.next(null);
    localStorage.clear();
    this.router.navigate(['/']);
    if (this.timerRefreshToken) {
      clearTimeout(this.timerRefreshToken);
      this.timerRefreshToken = null;
    }
  }

  /**
   * Handle the auth response received from the server by emitting a user and storing the token
   * inside the localStorage.
   */
  private handleAuth(response: HttpResponse<any>): void {

  }
}
