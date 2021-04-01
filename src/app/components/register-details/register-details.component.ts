import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {RegisterBasicModel} from '../../model/representation/register-basic.model';
import {NgForm} from '@angular/forms';
import {AuthenticationService} from '../../services/authentication.service';
import {Observable} from 'rxjs';
import {CanLeave} from '../../guards/utils/can.leave';
import {NotificationService} from '../../services/notification.service';
import {ModelUtil} from '../../model/util/model.util';
import {NotificationType} from '../../constants/notification-type.enum';
import {ConfirmModalComponent} from '../confirm-modal/confirm-modal.component';
import {ModalManagerService} from '../../services/modal-manager.service';

@Component({
  selector: 'app-register-details',
  templateUrl: './register-details.component.html',
  styleUrls: ['./register-details.component.css', '../../../assets/styles/login-register.css']
})
export class RegisterDetailsComponent implements OnInit, CanLeave {
  @ViewChild('f') completeRegisterForm: NgForm;
  basicDetails: RegisterBasicModel;
  isLoading = false;

  startDate = {year: 1980, month: 1, day: 1};
  dateMin = {year: 1950, month: 1, day: 1};
  dateMax = {year: 2021, month: 1, day: 1};

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private notificationService: NotificationService,
              private modalManager: ModalManagerService) {
    this.basicDetails = this.router.getCurrentNavigation().extras.state.registerBasic;
  }

  ngOnInit(): void {
  }

  onSubmitUser(): void {
    const completeUser = ModelUtil.buildUserFromFormValues(this.completeRegisterForm, this.basicDetails);
    this.isLoading = true;
    this.authenticationService.registerCompleteUser(completeUser).subscribe(() => {
      this.router.navigate(['/login']);
      this.notificationService.notify(NotificationType.SUCCESS, 'Your account was created with success!');
      this.isLoading = false;
    }, () => this.isLoading = false);
  }

  private isFormEmpty(): boolean {
    const values = this.completeRegisterForm.value;
    return values.firstName === '' && values.lastName === '' &&
      values.phone === '';
  }

  /**
   * Implements the CanLeave interface. Used in the canDeactivate Guard and it's making sure
   * that the user really wants to leave the page and that it was not a mistake.
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.isFormEmpty() && !this.completeRegisterForm.submitted) {
      this.modalManager.openConfirmModal(ConfirmModalComponent);
      return this.modalManager.getConfirmResult();
    }
    return true;
  }
}
