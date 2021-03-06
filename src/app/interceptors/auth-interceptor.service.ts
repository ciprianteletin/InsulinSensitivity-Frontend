import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../services/authentication.service';
import {exhaustMap, take} from 'rxjs/operators';
import {environment} from '../constants/environment';

/**
 * Intercept any request and send the jwt token to the server, if the user is authenticated.
 */
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(take(1), exhaustMap(user => {
      if (!user) {
        return next.handle(req);
      }
      const modifiedReq = req.clone({
        headers: req.headers.append(environment.authorization, `Bearer ${localStorage.getItem(environment.bearer)}`)
      });
      return next.handle(modifiedReq);
    }));
  }

}
