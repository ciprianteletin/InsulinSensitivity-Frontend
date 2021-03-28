import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {Subscription} from 'rxjs';
import {AES} from 'crypto-js';
import {environment} from '../../constants/environment';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedUser = false;
  username = 'Profile';
  isLoggedSubscription: Subscription;

  constructor(private authService: AuthenticationService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.isLoggedSubscription = this.authService.user.subscribe(user => {
      this.isLoggedUser = user !== null;
      if (user !== null) {
        this.username = user.username;
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

  navigateSettings(): void {
    this.router.navigate(['/settings',
      {username: AES.encrypt(this.username, environment.secretKey).toString()}]);
  }

  ngOnDestroy(): void {
    this.isLoggedSubscription.unsubscribe();
  }

}
