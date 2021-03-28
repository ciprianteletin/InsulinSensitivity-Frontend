import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '../../services/authentication.service';
import {SettingsService} from '../../services/settings.service';
import {UserModel} from '../../model/user.model';
import {UtilsService} from '../../services/utils.service';
import {NgForm} from '@angular/forms';
import {CustomFormMap} from '../../model/custom-form-map.model';
import {SettingUtils} from '../../utils/setting.utils';
import {DetailedUserModel} from '../../model/detailed-user.model';
import {ActivatedRoute} from '@angular/router';
import {CacheService} from '../../services/cache.service';
import {SHA3} from 'crypto-js';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css', '../../../assets/styles/utils.css'],
  providers: [SettingUtils]
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
  // elements custom data structures
  private divSections: ElementRef[];
  private formMap: CustomFormMap;
  // subscriptions
  private userSubscription: Subscription;
  // Data Model
  country: string;
  userAge: number;
  user: UserModel;
  mainDetailedUser: DetailedUserModel;
  detailedUser: DetailedUserModel;

  constructor(private authService: AuthenticationService,
              private settingsService: SettingsService,
              private utilsService: UtilsService,
              private settingUtils: SettingUtils,
              private route: ActivatedRoute,
              private cacheService: CacheService) {
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { detailedUser: DetailedUserModel, country: { country: string } }) => {
      this.setData(data);
      this.storeInCache();
    });
    this.userSubscription = this.authService.user
      .subscribe(user => this.user = user);
  }

  /**
   * Hook called after the view is rendered in the browser, so that we have access to any HTML
   * element with a reference (#name) on it.
   */
  ngAfterViewInit(): void {
    this.divSections = [this.activeGeneral, this.activeHistory, this.activeInfo, this.activePassword];
    this.formMap = {
      accountGeneral: this.generalForm,
      accountInfo: this.infoForm,
      accountPassword: this.passwordForm
    };
  }

  onSaveChanges(): void {
    const activePanel = this.utilsService.getActiveElementId(this.divSections);
    const flag = this.settingUtils.checkValidForm(activePanel, this.formMap);
    if (flag) {
      this.settingsService.submitActiveForm(activePanel, this.formMap, this.mainDetailedUser);
      this.alignMainAndDisplayedUser();
    }
  }

  onLogout(): void {
    this.authService.logout();
  }

  clearCurrentForm(): void {
    const activePanel = this.utilsService.getActiveElementId(this.divSections);
    switch (activePanel) {
      case 'accountGeneral':
      case 'accountInfo':
        this.detailedUser = Object.assign({}, this.mainDetailedUser);
        this.detailedUser.details = Object.assign({}, this.mainDetailedUser.details);
        break;
      case 'activeHistory':
        this.utilsService.onResetDate();
        break;
    }
  }

  private setData(data: { detailedUser: DetailedUserModel, country: { country: string } }): void {
    this.mainDetailedUser = data.detailedUser;
    this.detailedUser = Object.assign({}, data.detailedUser);
    this.detailedUser.details = Object.assign({}, data.detailedUser.details);
    this.country = data.country.country;
    this.userAge = this.utilsService.convertBirthDayToAge(data.detailedUser.details.birthDay);
  }

  private alignMainAndDisplayedUser(): void {
    this.mainDetailedUser = Object.assign({}, this.detailedUser);
    this.mainDetailedUser.details = Object.assign({}, this.detailedUser.details);
  }

  private storeInCache(): void {
    const encryptedUsername = SHA3(this.detailedUser.username).toString();
    this.cacheService.saveItem(encryptedUsername, this.country);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
