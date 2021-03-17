import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from './services/authentication.service';
import {environment} from './constants/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.authService.autoLogin();
  }

  ngOnDestroy(): void {
    localStorage.removeItem(environment.tokenHeader);
  }
}
