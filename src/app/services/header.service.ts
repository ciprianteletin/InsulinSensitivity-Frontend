import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {AuthenticationService} from './authentication.service';
import {NotificationType} from '../constants/notification-type.enum';
import {NotificationService} from './notification.service';
import {AES} from 'crypto-js';
import {environment} from '../constants/environment';
import {Router} from '@angular/router';
import {SettingsService} from './settings.service';

@Injectable({providedIn: 'root'})
export class HeaderService {
  private activateSidebar = new Subject<void>();

  constructor(private authService: AuthenticationService,
              private notificationService: NotificationService,
              private router: Router,
              private settingsService: SettingsService) {
  }

  logout(): void {
    this.authService.logout()
      .subscribe(() => this.notificationService.notify(NotificationType.SUCCESS, 'Logged out with success!'));
  }

  navigateSettings(username: string): void {
    this.settingsService.emitActiveElement('accountGeneral');
    this.router.navigate(['/settings'], {
      queryParams: {username: AES.encrypt(username, environment.secretKey).toString()}
    });
  }

  navigateInsulinCalculator(username: string): void {
    if (!username) {
      this.router.navigate(['insulin/calculator']);
      return;
    }
    this.router.navigate(['insulin/calculator'], {
      queryParams: {username: AES.encrypt(username, environment.secretKey).toString()}
    });
  }

  changeSidebarValue(): void {
    this.activateSidebar.next();
  }

  getSidebarEvent(): Subject<void> {
    return this.activateSidebar;
  }
}
