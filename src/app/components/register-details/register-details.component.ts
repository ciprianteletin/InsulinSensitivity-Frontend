import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {RegisterBasicModel} from '../../model/register-basic.model';
import {NgForm} from '@angular/forms';
import {RegisterService} from '../../services/register.service';
import {GenericResponseModel} from '../../model/generic-response.model';

@Component({
  selector: 'app-register-details',
  templateUrl: './register-details.component.html',
  styleUrls: ['./register-details.component.css', '../../../assets/styles/login-register.css']
})
export class RegisterDetailsComponent implements OnInit {
  @ViewChild('f') completeRegisterForm: NgForm;
  basicDetails: RegisterBasicModel;
  isLoading = false;

  constructor(private router: Router,
              private registerService: RegisterService) {
    this.basicDetails = this.router.getCurrentNavigation().extras.state.registerBasic;
  }

  ngOnInit(): void {
  }

  onSubmitUser(): void {
    const completeUser = this.registerService.buildUserFromFormValues(this.completeRegisterForm, this.basicDetails);
    this.isLoading = true;
    this.registerService.registerCompleteUser(completeUser).subscribe((status: GenericResponseModel) => {
      this.router.navigate(['/login']);
      this.isLoading = false;
    }, error => {
        console.log(error);
    });
  }

}
