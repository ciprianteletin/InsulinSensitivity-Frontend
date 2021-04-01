import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {RegisterBasicModel} from '../../model/representation/register-basic.model';
import {CanLeave} from '../../guards/utils/can.leave';
import {Observable} from 'rxjs';
import {ConfirmModalComponent} from '../confirm-modal/confirm-modal.component';
import {ModalManagerService} from '../../services/modal-manager.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../../../assets/styles/login-register.css']
})
export class RegisterComponent implements OnInit, CanLeave {
  @ViewChild('f') registerForm: NgForm;

  constructor(private router: Router,
              private modalManager: ModalManagerService) {
  }

  ngOnInit(): void {
  }

  onSubmitForm(): void {
    const basicModel: RegisterBasicModel = this.registerForm.value;
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
      this.modalManager.openConfirmModal(ConfirmModalComponent);
      return this.modalManager.getConfirmResult();
    }
    return true;
  }
}
