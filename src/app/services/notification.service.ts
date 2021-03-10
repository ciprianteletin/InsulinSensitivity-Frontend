import {Injectable} from '@angular/core';
import {NotifierService} from 'angular-notifier';
import {NotificationType} from '../constants/notification-type.enum';

/**
 * Class used for notifications and managing different events which will launch a notification in the application.
 */
@Injectable({providedIn: 'root'})
export class NotificationService {
  constructor(private notifier: NotifierService) {
  }

  public notify(type: NotificationType, message: string): void {
    this.notifier.notify(type, message);
  }
}
