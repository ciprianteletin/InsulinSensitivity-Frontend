import {Injectable} from '@angular/core';
import {CompleteUserModel} from '../model/representation/complete-user.model';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {environment} from '../constants/environment';
import {GenericResponseModel} from '../model/representation/generic-response.model';
import {UserModel} from '../model/representation/user.model';
import {Router} from '@angular/router';
import {catchError, tap} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {NotificationService} from './notification.service';
import {NotificationType} from '../constants/notification-type.enum';
import {CacheService} from './cache.service';
import {errors} from '../constants/error.constants';

/**
 * Service that tackles every request/operation related to the authentication process. It returns an Observable, letting
 * the component decide what to do next in case of failure/success. Uses as mechanism to communicate with other services/component
 * an BehaviourSubject, witch pass the last value emitted. If the user logged before the subscription, the service/comp. calling
 * for the actual user will receive it's data.
 */
@Injectable({providedIn: 'root'})
export class AuthenticationService {
  user = new BehaviorSubject<UserModel>(null);
  loggedUser = new BehaviorSubject<boolean>(false);
  private captchaEvent = new Subject<boolean>();

  private isLoggedIn = false;
  private jwtHelper = new JwtHelperService();
  private timerRefreshToken: any;
  private userId: number;

  constructor(private http: HttpClient,
              private router: Router,
              private notificationService: NotificationService,
              private cacheService: CacheService) {
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
    return this.http.post(`${environment.url}/login`, user, environment.httpOptions)
      .pipe(
        tap(response => {
          this.handleAuth(response);
        }));
  }

  /**
   * Clear all trace of the logged user and send a request to the server to delete related metaData in case of
   * manual log-out. Also redirect the user to the main page
   */
  logout(): Observable<any> {
    return this.http.get(`${environment.url}/logout/${this.userId}`)
      .pipe(tap(() => {
        this.router.navigate(['/']);
        this.resetUserState();
        this.cacheService.clearCache();
        localStorage.removeItem(environment.bearer);
        this.clearTimeoutIfNeeded();
      }));
  }

  /**
   * The unexpected logout method was created for exceptional cases, when the account of the user was deleted
   * from the server, not by the user (for example, someone deletes the entire database) and the user is still logged on.
   * In this case, the logout method will fail, because a request is made for logout.
   *
   * Clears every client side information.
   */
  private unexpectedLogout(): void {
    this.resetUserState();
    this.cacheService.clearCache();
    localStorage.removeItem(environment.bearer);
    this.clearTimeoutIfNeeded();
  }

  /**
   * Method invoked at the start of the application. It calls a special endpoint and based on multiple details,
   * like the refreshToken and the MetaInformation, the server will decide if the user was logged in
   * in the last seven days on the current device and login him if he meets all criteria.
   *
   * Also, this method is used in case of page refresh, the Angular engine restarting the app in
   * case of page/browser refresh.
   */
  autoLogin(): Promise<any> {
    return this.http.get<HttpResponse<UserModel>>(`${environment.url}/autologin`, environment.httpOptions)
      .pipe(tap((res => {
          // if the status is 204, it means that "NO_CONTENT" was sent
          if (res.status !== environment.no_content) {
            this.handleAuth(res);
          }
        })),
        catchError((err) => {
          this.notificationService.notify(NotificationType.ERROR, 'Autologin failed!');
          this.unexpectedLogout();
          return of(err);
        })).toPromise();
  }

  /**
   * Calls the update token request when the user change his username used for login and other
   * operations. This is necessary because the Jwt-Token contains information related to
   * the previous information, so that there would be no sync between the actual user and
   * what resides in token.
   *
   * In case of any error, the user will be logged out due to security reasons.
   */
  updateTokenNewDetails(username: string): void {
    this.http.get(`${environment.url}/updateToken/${username}`, environment.httpOptions)
      .subscribe((response: HttpResponse<any>) => {
        this.handleAuthToken(response);
      }, () => {
        this.logout().subscribe();
        this.notificationService.notify(NotificationType.ERROR, errors.ERROR_LOGOUT);
      });
  }

  emitNewUser(user: UserModel): void {
    this.user.next(user);
  }

  getCaptchaEvent(): Subject<boolean> {
    return this.captchaEvent;
  }

  isLoggedUser(): boolean {
    return this.isLoggedIn;
  }

  private handleAuth(response: HttpResponse<any>): void {
    this.handleAuthToken(response);
    this.emitLoggedUser(response);
  }

  private resetUserState(): void {
    this.user.next(null);
    this.loggedUser.next(false);
    this.userId = null;
    this.isLoggedIn = false;
  }

  /**
   * Handle the auth response received from the server by emitting a user and storing the token
   * inside the localStorage. Also it launch a timeout of 10 minutes in order to refresh the token.
   * The duration of the token is 15 minutes but we take in consideration that some operations
   * might take some time.
   */
  private handleAuthToken(response: HttpResponse<any>): void {
    const token = response.headers.get(environment.tokenHeader);
    const refreshTime = this.jwtHelper.getTokenExpirationDate(token).getTime()
      - new Date().getTime() - environment.fiveMinutesInMs;
    this.clearTimeoutIfNeeded();
    this.timerRefreshToken = setTimeout(() => this.getNewToken(), refreshTime);
    localStorage.setItem(environment.bearer, token);
  }

  /**
   * Clear the current time-out, even if it's already expired.
   */
  private clearTimeoutIfNeeded(): void {
    if (this.timerRefreshToken) {
      clearTimeout(this.timerRefreshToken);
      this.timerRefreshToken = null;
    }
  }

  /**
   * Handles and emit a new user, the logged one, operation available only on login.
   */
  private emitLoggedUser(response: HttpResponse<any>): void {
    const loggedUser: UserModel = {
      id: response.body.id,
      username: response.body.username,
    };
    this.userId = response.body.id;
    this.isLoggedIn = true;
    this.loggedUser.next(true);
    this.user.next(loggedUser);
  }

  /**
   * Every 10 minutes a new token is received from backend. This methods prevents any theft who might stole
   * the token to use the application, because in 15 minutes the token will be invalid and a new one will be emitted.
   */
  getNewToken(): void {
    this.http.get<GenericResponseModel>(`${environment.url}/refresh/${this.userId}`, environment.httpOptions)
      .subscribe(response => this.handleAuthToken(response), () => {
        localStorage.removeItem(environment.bearer);
        this.user.next(null);
      });
  }

  /**
   * Check if the response obtained contains a header related to captcha.
   * If yes, captcha will be enabled and displayed.
   */
  checkIfCaptcha(response: HttpErrorResponse): void {
    const activateCaptcha = response.headers.get(environment.captchaHeader);
    if (activateCaptcha && activateCaptcha === environment.captchaValue) {
      this.captchaEvent.next(true);
    }
  }
}
