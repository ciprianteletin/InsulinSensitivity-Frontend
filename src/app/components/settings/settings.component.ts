import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {AuthenticationService} from '../../services/authentication.service';
import {SettingsService} from '../../services/settings.service';
import {UserModel} from '../../model/user.model';
import {UtilsService} from '../../services/utils.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css', '../../../assets/styles/utils.css']
})
export class SettingsComponent implements OnInit, OnDestroy, AfterViewInit {
  // divs for active one
  @ViewChild('accountGeneral') activeGeneral: ElementRef;
  @ViewChild('accountInfo') activeInfo: ElementRef;
  @ViewChild('accountPassword') activePassword: ElementRef;
  @ViewChild('activeHistory') activeHistory: ElementRef;
  // forms
  @ViewChild('general') generalForm: NgForm;
  @ViewChild('info') infoForm: NgForm;
  @ViewChild('passwords') passwordForm: NgForm;
  private divSections: ElementRef[];

  private userSubscription: Subscription;
  countyObservable: Observable<{ country: string }>;
  user: UserModel;

  constructor(private authService: AuthenticationService,
              private settingsService: SettingsService,
              private utilsService: UtilsService) {
  }

  ngOnInit(): void {
    this.countyObservable = this.settingsService.getUserCountryOrNothing();
    this.userSubscription = this.authService.user //
      .subscribe(user => this.user = user);
  }

  ngAfterViewInit(): void {
    this.divSections = [this.activeGeneral, this.activeHistory, this.activeInfo, this.activePassword];
  }

  onLogout(): void {
    this.authService.logout();
  }

  clearCurrentForm(): void {
    const activePanel = this.utilsService.getActiveElementId(this.divSections);
    switch (activePanel) {
      case 'account-general':
        this.generalForm.resetForm();
        break;
      case 'account-change-password':
        this.passwordForm.resetForm();
        break;
      case 'account-info':
        this.infoForm.resetForm();
        break;
      default:
        this.utilsService.onResetDate();
    }
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
