import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {AuthenticationService} from '../../services/authentication.service';
import {SettingsService} from '../../services/settings.service';
import {UserModel} from '../../model/user.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css', '../../../assets/styles/utils.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;
  countyObservable: Observable<{ country: string }>;
  user: UserModel;

  constructor(private authService: AuthenticationService,
              private settingsService: SettingsService) {
  }

  ngOnInit(): void {
    this.countyObservable = this.settingsService.getUserCountryOrNothing();
    this.userSubscription = this.authService.user //
      .subscribe(user => this.user = user);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}
