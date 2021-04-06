import {Component, OnDestroy, OnInit} from '@angular/core';
import {HeaderService} from '../../services/header.service';
import {AuthenticationService} from '../../services/authentication.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {AES} from 'crypto-js';
import {environment} from '../../constants/environment';
import {InsulinIndexesService} from '../../services/insulin-indexes.service';

@Component({
  selector: 'app-complex-header',
  templateUrl: './complex-header.component.html',
  styleUrls: ['./complex-header.component.css']
})
export class ComplexHeaderComponent implements OnInit, OnDestroy {
  isLoggedUser = false;
  username: string;
  userId: number;
  isLoggedSubscription: Subscription;

  constructor(private headerService: HeaderService,
              private authService: AuthenticationService,
              private router: Router,
              private insulinService: InsulinIndexesService) {
  }

  ngOnInit(): void {
    this.createSubscriptions();
  }

  onLogout(): void {
    this.headerService.logout();
  }

  navigateInsulinForm(): void {
    this.insulinService.populateWithCompleteIndexes();
    this.headerService.navigateInsulinCalculator(this.username);
  }

  navigateSettings(): void {
    this.headerService.navigateSettings(this.username);
  }

  onActivateSidebar(): void {
    this.headerService.changeSidebarValue();
  }

  private createSubscriptions(): void {
    this.isLoggedSubscription = this.authService.user.subscribe(user => {
      this.isLoggedUser = user !== null;
      if (user !== null) {
        this.username = user.username;
        this.userId = user.id;
      }
    });
  }

  ngOnDestroy(): void {
    this.isLoggedSubscription.unsubscribe();
  }
}
