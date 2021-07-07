import {Injectable} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';

/**
 * When the application start, the client will check if the user was authenticated in the last 7 days.
 */
@Injectable()
export class AppInitService {
  constructor(private authService: AuthenticationService) {
  }

  init(): Promise<any> {
    return this.authService.autoLogin();
  }
}
