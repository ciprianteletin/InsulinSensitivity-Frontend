import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {RegisterBasicModel} from '../../model/register-basic.model';
import {NgForm} from '@angular/forms';
import {AuthenticationService} from '../../services/authentication.service';
import {GenericResponseModel} from '../../model/generic-response.model';
import {Observable} from 'rxjs';
import {CanLeave} from '../../guards/utils/can.leave';

@Component({
  selector: 'app-register-details',
  templateUrl: './register-details.component.html',
  styleUrls: ['./register-details.component.css', '../../../assets/styles/login-register.css']
})
export class RegisterDetailsComponent implements OnInit, CanLeave {
  @ViewChild('f') completeRegisterForm: NgForm;
  basicDetails: RegisterBasicModel;
  isLoading = false;

  constructor(private router: Router,
              private authenticationService: AuthenticationService) {
    this.basicDetails = this.router.getCurrentNavigation().extras.state.registerBasic;
  }

  ngOnInit(): void {
  }

  onSubmitUser(): void {
    const completeUser = this.authenticationService.buildUserFromFormValues(this.completeRegisterForm, this.basicDetails);
    this.isLoading = true;
    this.authenticationService.registerCompleteUser(completeUser).subscribe((status: GenericResponseModel) => {
      this.router.navigate(['/login']);
      this.isLoading = false;
    }, error => this.isLoading = false);
  }

  private isFormEmpty(): boolean {
    const values = this.completeRegisterForm.value;
    return values.firstName === '' && values.lastName === '' &&
      values.phone === '' && values.age === '';
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.isFormEmpty()) {
      return confirm('Do you want to discard the changes?');
    }
    return true;
  }

}
