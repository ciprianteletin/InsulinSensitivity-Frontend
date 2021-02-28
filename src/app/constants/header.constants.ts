import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class HeaderConstants {
  basicHeader = ['/login', '/login/forget', '/register', '/resetPassword', '/register/details', '/', ''];
}
