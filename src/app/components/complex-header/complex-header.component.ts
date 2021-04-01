import {Component, OnDestroy, OnInit} from '@angular/core';
import {HeaderService} from '../../services/header.service';
import {AuthenticationService} from '../../services/authentication.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {AES} from 'crypto-js';
import {environment} from '../../constants/environment';
import {NotificationService} from '../../services/notification.service';
import {NotificationType} from '../../constants/notification-type.enum';

@Component({
  selector: 'app-complex-header',
  templateUrl: './complex-header.component.html',
  styleUrls: ['./complex-header.component.css']
})
export class ComplexHeaderComponent implements OnInit, OnDestroy {
  isLoggedUser = false;
  username = 'Profile';
  userId: number;
  isLoggedSubscription: Subscription;

  constructor(private headerService: HeaderService,
              private authService: AuthenticationService,
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

  onActivateSidebar(): void {
    this.headerService.changeSidebarValue();
  }

  private createSubscriptions(): void {
    this.isLoggedSubscription = this.authService.user.subscribe(user => {
      this.isLoggedUser = user !== null;
      if (user !== null) {
        this.username = user.username;
        this.userId = user.id;
      }
    });
  }

  ngOnDestroy(): void {
    this.isLoggedSubscription.unsubscribe();
  }
}
