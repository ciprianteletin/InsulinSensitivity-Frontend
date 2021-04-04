import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {Subscription} from 'rxjs';
import {AES} from 'crypto-js';
import {environment} from '../../constants/environment';
import {Router} from '@angular/router';
import {NotificationService} from '../../services/notification.service';
import {NotificationType} from '../../constants/notification-type.enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedUser = false;
  username: string;
  isLoggedSubscription: Subscription;

  constructor(private authService: AuthenticationService,
              private router: Router,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.createSubscriptions();
  }

  onLogout(): void {
    this.authService.logout()
      .subscribe(() => this.notificationService.notify(NotificationType.SUCCESS, 'Logged out with success!'));
  }

  navigateSettings(): void {
    this.router.navigate(['/settings'], {
      queryParams: {username: AES.encrypt(this.username, environment.secretKey).toString()}
    });
  }

  private createSubscriptions(): void {
    this.isLoggedSubscription = this.authService.user.subscribe(user => {
      this.isLoggedUser = user !== null;
      if (user !== null) {
        this.username = user.username;
      }
    });
  }

  ngOnDestroy(): void {
    this.isLoggedSubscription.unsubscribe();
  }

}
