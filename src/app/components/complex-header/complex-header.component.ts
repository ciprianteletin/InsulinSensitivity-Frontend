import {Component, OnDestroy, OnInit} from '@angular/core';
import {HeaderService} from '../../services/header.service';
import {AuthenticationService} from '../../services/authentication.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {AES} from 'crypto-js';
import {environment} from '../../constants/environment';

@Component({
  selector: 'app-complex-header',
  templateUrl: './complex-header.component.html',
  styleUrls: ['./complex-header.component.css']
})
export class ComplexHeaderComponent implements OnInit, OnDestroy {
  isLoggedUser = false;
  username = 'Profile';
  userId: number;
  isLoggedSubscription: Subscription;

  constructor(private headerService: HeaderService,
              private authService: AuthenticationService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.isLoggedSubscription = this.authService.user.subscribe(user => {
      this.isLoggedUser = user !== null;
      if (user !== null) {
        this.username = user.username;
        this.userId = user.id;
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

  onActivateSidebar(): void {
    this.headerService.changeSidebarValue();
  }

  ngOnDestroy(): void {
    this.isLoggedSubscription.unsubscribe();
  }
}
