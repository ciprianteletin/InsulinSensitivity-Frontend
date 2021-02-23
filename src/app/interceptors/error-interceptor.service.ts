import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ErrorService} from '../services/error.service';

@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {
  constructor(private errorService: ErrorService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError((genericError: HttpErrorResponse) => {
      this.errorService.emitValue(genericError.error);
      return throwError(genericError.error);
    }));
  }
}
