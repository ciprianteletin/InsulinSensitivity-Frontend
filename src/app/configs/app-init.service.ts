import {Injectable} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';

@Injectable()
export class AppInitService {
  constructor(private authService: AuthenticationService) {
  }

  init(): Promise<any> {
    return this.authService.autoLogin();
  }
}
