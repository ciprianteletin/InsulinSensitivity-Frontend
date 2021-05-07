import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subscription, throwError} from 'rxjs';
import {CanLeave} from '../../guards/utils/can.leave';
import {NotificationService} from '../../services/notification.service';
import {NotificationType} from '../../constants/notification-type.enum';
import {catchError, take} from 'rxjs/operators';
import {ReCaptcha2Component} from 'ngx-captcha';
import {HttpErrorResponse} from '@angular/common/http';
import {ModalManagerService} from '../../services/modal-manager.service';
import {ConfirmModalComponent} from '../confirm-modal/confirm-modal.component';
import {CookieService} from 'ngx-cookie-service';
import {AES} from 'crypto-js';
import {environment} from '../../constants/environment';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css',
    '../../../assets/styles/login-register.css',
    '../../../assets/styles/utils.css']
})
export class LoginComponent implements OnInit, OnDestroy, CanLeave {
  @ViewChild('f') loginForm: NgForm;
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;

  resetPassword: boolean;
  routerEvent: Subscription;
  siteKey: string;
  displayCaptcha = false;
  username = '';

  constructor(private authService: AuthenticationService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private notificationService: NotificationService,
              private modalManager: ModalManagerService,
              private cookieService: CookieService) {
    this.siteKey = '6LdlhXkaAAAAAF1yMLOiVExYDrkkaO_rtsJFDrQB';
  }

  /**
   * Subscribes to different events used for multiple purposes.
   */
  ngOnInit(): void {
    this.consultCookie();
    this.subscribeToRouterEvents();
    this.getCaptchaEvents();
  }

  login(): void {
    this.authService.login(this.loginForm.value)
      .pipe(catchError((genericError: HttpErrorResponse) => {
        if (this.displayCaptcha) {
          this.captchaElem.resetCaptcha();
        }
        this.authService.checkIfCaptcha(genericError);
        return throwError(genericError);
      }))
      .subscribe(() => {
        this.rememberMeCookie();
        this.router.navigate(['/insulin']);
        this.notificationService.notify(NotificationType.DEFAULT, 'You are now logged in!');
      });
  }

  onForgetPassword(): void {
    this.router.navigate(['forget'], {relativeTo: this.activeRoute});
  }

  private rememberMeCookie(): void {
    const rememberMe = this.loginForm.value.remember;
    if (rememberMe) {
      this.cookieService.set('rememberMe', 'true');
      const username = AES.encrypt(this.loginForm.value.username, environment.secretKey).toString();
      this.cookieService.set('username', username);
    } else {
      this.cookieService.deleteAll();
    }
  }

  private isFormEmpty(): boolean {
    return this.loginForm.value.username === '' && this.loginForm.value.password === '';
  }

  private subscribeToRouterEvents(): void {
    this.routerEvent = this.router.events
      .subscribe(() => {
        this.resetPassword = !(this.router.url.toString() === '/login');
      });
  }

  private getCaptchaEvents(): void {
    this.authService.getCaptchaEvent()
      .pipe(take(1))
      .subscribe(activateCaptcha => {
        this.displayCaptcha = activateCaptcha;
      });
  }

  private consultCookie(): void {
    const rememberMe = this.cookieService.check('rememberMe');
    if (rememberMe) {
      this.username = AES.decrypt(this.cookieService.get('username'), environment.secretKey).toString(CryptoJS.enc.Utf8);
    }
  }

  /**
   * Implements the CanLeave interface. Used in the canDeactivate Guard and it's making sure
   * that the user really wants to leave the page and that it was not a mistake.
   */
  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    if (this.resetPassword) {
      return true;
    }
    if (!this.isFormEmpty() && !this.loginForm.submitted) {
      this.modalManager.openConfirmModal(ConfirmModalComponent);
      return this.modalManager.getConfirmResult();
    }
    return true;
  }

  ngOnDestroy(): void {
    this.routerEvent.unsubscribe();
  }
}
