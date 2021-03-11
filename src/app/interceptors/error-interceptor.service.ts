import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ErrorService} from '../services/error.service';
import {environment} from '../constants/environment';
import {NotificationService} from '../services/notification.service';
import {NotificationType} from '../constants/notification-type.enum';

/**
 * Gracefully intercepts every error in our request and decide the best
 * way to display a descriptive notification related to the error.
 */
@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {
  constructor(private errorService: ErrorService,
              private notificationService: NotificationService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError((genericError: HttpErrorResponse) => {
      const error = genericError.error;
      if (error.httpStatusCode < environment.internal_error_code) {
        this.errorService.emitValue(error);
      } else {
        this.notificationService.notify(NotificationType.ERROR, error.message);
      }
      return throwError(genericError);
    }));
  }
}
