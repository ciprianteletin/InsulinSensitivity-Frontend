import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {NotifierService} from 'angular-notifier';
import {NotificationType} from '../constants/notification-type.enum';

export interface NotificationMessage {
  flag: boolean;
  message: string;
}

@Injectable({providedIn: 'root'})
export class NotificationService {
  constructor(private notifier: NotifierService) {
  }

  private registerNotification = new BehaviorSubject<boolean>(null);
  private loginNotification = new BehaviorSubject<NotificationMessage>(null);

  public emitRegisterNotification(value: boolean): void {
    this.registerNotification.next(value);
  }

  public getRegisterNotification(): BehaviorSubject<boolean> {
    return this.registerNotification;
  }

  public emitLoginNotification(value: boolean, message: string): void {
    this.loginNotification.next({flag: value, message});
  }

  public getLoginNotification(): BehaviorSubject<NotificationMessage> {
    return this.loginNotification;
  }

  public notify(type: NotificationType, message: string): void {
    this.notifier.notify(type, message);
  }
}
