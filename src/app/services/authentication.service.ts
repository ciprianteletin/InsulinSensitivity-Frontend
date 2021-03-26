import {Injectable} from '@angular/core';
import {CompleteUserModel} from '../model/complete-user.model';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {environment} from '../constants/environment';
import {GenericResponseModel} from '../model/generic-response.model';
import {UserModel} from '../model/user.model';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {NotificationService} from './notification.service';
import {NotificationType} from '../constants/notification-type.enum';
import {CacheService} from './cache.service';

/**
 * Service that tackles every request/operation related to the authentication process. It returns an Observable, letting
 * the component decide what to do next in case of failure/success. Uses as mechanism to communicate with other services/component
 * an BehaviourSubject, witch pass the last value emitted. If the user logged before the subscription, the service/comp. calling
 * for the actual user will receive it's data.
 */
@Injectable({providedIn: 'root'})
export class AuthenticationService {
  user = new BehaviorSubject<UserModel>(null);
  private captchaEvent = new Subject<boolean>();

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
          this.emitNewUser(response);
        }));
  }

  /**
   * Clear all trace of the logged user and send a request to the server to delete related metaData in case of
   * manual log-out. Also redirect the user to the main page
   */
  logout(): void {
    this.http.get(`${environment.url}/logout/${this.userId}`)
      .subscribe(() => {
        this.router.navigate(['/']);
        this.user.next(null);
        this.userId = null;
        this.cacheService.clearCache();
        localStorage.removeItem(environment.bearer);
        this.clearTimeoutIfNeeded();
      });
  }

  /**
   * Method invoked at the start of the application. It calls a special endpoint and based on multiple details,
   * like the refreshToken and the MetaInformation, the server will decide if the user was logged in
   * in the last seven days on the current device and login him if he meets all criteria.
   */
  autoLogin(): void {
    this.http.get<HttpResponse<UserModel>>(`${environment.url}/autologin`, environment.httpOptions)
      .subscribe(res => {
        // if the status is 204, it means that "NO_CONTENT" was sent
        if (res.status !== 204) {
          this.handleAuth(res);
          this.emitNewUser(res);
          this.router.navigate(['/insulin']);
          this.notificationService.notify(NotificationType.DEFAULT, 'Welcome back!');
        }
      });
  }

  getCaptchaEvent(): Subject<boolean> {
    return this.captchaEvent;
  }

  /**
   * Handle the auth response received from the server by emitting a user and storing the token
   * inside the localStorage. Also it launch a timeout of 14 minutes in order to refresh the token.
   * The duration of the token is 15 minutes but we take in consideration that some operations
   * might take some time.
   */
  private handleAuth(response: HttpResponse<any>): void {
    const token = response.headers.get(environment.tokenHeader);
    const refreshTime = this.jwtHelper.getTokenExpirationDate(token).getTime()
      - new Date().getTime() - environment.oneMinuteInMs;
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
  private emitNewUser(response: HttpResponse<any>): void {
    const loggedUser: UserModel = {
      id: response.body.id,
      username: response.body.username,
    };
    this.userId = response.body.id;
    this.user.next(loggedUser);
  }

  /**
   * Every 14-15 minutes a new token is received from backend. This methods prevents any theft who might stole
   * the token to use the application, because in 15 minutes the token will be invalid and a new one will be emitted.
   */
  private getNewToken(): void {
    this.http.get<GenericResponseModel>(`${environment.url}/refresh/${this.userId}`, environment.httpOptions)
      .subscribe(response => this.handleAuth(response));
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
