import {Component, OnDestroy, OnInit} from '@angular/core';
import {NotificationService} from '../../services/notification.service';
import {Subscription} from 'rxjs';
import {NotificationType} from '../../constants/notification-type.enum';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit, OnDestroy {
  private loginEvent: Subscription;

  constructor(private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.loginEvent = this.notificationService.getLoginNotification().subscribe(notifications => {
      if (notifications && notifications.flag) {
        this.notificationService.notify(NotificationType.DEFAULT, notifications.message);
        this.notificationService.emitLoginNotification(false, '');
      }
    });
  }

  ngOnDestroy(): void {
    this.loginEvent.unsubscribe();
  }
}
