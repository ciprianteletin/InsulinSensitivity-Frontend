import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {RegisterBasicModel} from '../../model/representation/register-basic.model';
import {CanLeave} from '../../guards/utils/can.leave';
import {Observable, Subscription} from 'rxjs';
import {ConfirmModalComponent} from '../confirm-modal/confirm-modal.component';
import {ModalManagerService} from '../../services/modal-manager.service';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../../../assets/styles/login-register.css']
})
export class RegisterComponent implements OnInit, OnDestroy, CanLeave {
  @ViewChild('f') registerForm: NgForm;
  private confirmSubscription: Subscription;

  constructor(private router: Router,
              private modalManager: ModalManagerService,
              private authService: AuthenticationService) {
  }

  ngOnInit(): void {
  }

  onSubmitForm(): void {
    const basicModel: RegisterBasicModel = this.registerForm.value;
    this.authService.checkPassword(basicModel.password)
      .subscribe((result) => {
        if (result === 1) {
          this.submitData(basicModel);
        } else {
          this.modalManager.openConfirmModal(ConfirmModalComponent,
            'Your password is not secured!',
            'Do you want to proceed with it?');
          this.confirmSubscription = this.modalManager.getConfirmResult()
            .subscribe((confirm: boolean) => {
              if (confirm) {
                this.submitData(basicModel);
              }
            });
        }
      });
  }

  private submitData(basicModel: RegisterBasicModel): void {
    this.router.navigate(['/register', 'details'], {
      state: {
        registerBasic: basicModel
      }
    });
  }

  private isFormEmpty(): boolean {
    const values = this.registerForm.value;
    return values.username === '' && values.password === '' &&
      values.email === '' && values.confirmPassword === '';
  }

  /**
   * Implements the CanLeave interface. Used in the canDeactivate Guard and it's making sure
   * that the user really wants to leave the page and that it was not a mistake.
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.isFormEmpty() && !this.registerForm.submitted) {
      this.modalManager.openConfirmModal(ConfirmModalComponent,
        'Are you sure you want to leave the register page?',
        'All data will be lost!');
      return this.modalManager.getConfirmResult();
    }
    return true;
  }

  ngOnDestroy(): void {
    if (this.confirmSubscription) {
      this.confirmSubscription.unsubscribe();
    }
  }
}
