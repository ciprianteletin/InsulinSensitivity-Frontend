import {Component, OnDestroy, OnInit} from '@angular/core';
import {HeaderService} from '../../services/header.service';
import {AuthenticationService} from '../../services/authentication.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-complex-header',
  templateUrl: './complex-header.component.html',
  styleUrls: ['./complex-header.component.css']
})
export class ComplexHeaderComponent implements OnInit, OnDestroy {
  isLoggedUser = false;
  username = 'Profile';
  isLoggedSubscription: Subscription;

  constructor(private headerService: HeaderService,
              private authService: AuthenticationService) {
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

  onActivateSidebar(): void {
    this.headerService.changeSidebarValue();
  }

  ngOnDestroy(): void {
    this.isLoggedSubscription.unsubscribe();
  }
}
