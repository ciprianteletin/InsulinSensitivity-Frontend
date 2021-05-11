import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {Subscription} from 'rxjs';
import {HeaderService} from '../../services/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedUser = false;
  username: string;
  isLoggedSubscription: Subscription;

  constructor(private headerService: HeaderService,
              private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.createSubscriptions();
  }

  onLogout(): void {
    this.headerService.logout();
  }

  navigateSettings(): void {
    this.headerService.navigateSettings(this.username);
  }

  private createSubscriptions(): void {
    this.isLoggedSubscription = this.authService.user.subscribe(user => {
      this.isLoggedUser = user !== null;
      if (user !== null) {
        this.username = user.username;
      }
    });
  }

  ngOnDestroy(): void {
    this.isLoggedSubscription.unsubscribe();
  }
}
