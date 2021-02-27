import {Component, OnInit, ViewChild} from '@angular/core';
import {ManagePasswordService} from '../../services/manage-password.service';
import {NgForm} from '@angular/forms';
import {UserModel} from '../../model/user.model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css', '../../../assets/styles/login-register.css']
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild('f') resetForm: NgForm;

  constructor(private passwordManager: ManagePasswordService) {
  }

  ngOnInit(): void {
  }

  resetPassword(): void {
    this.passwordManager.resetPassword(this.buildUser()).subscribe();
  }

  private buildUser(): UserModel {
    return {
      username: this.resetForm.value.username,
      password: this.resetForm.value.password
    };
  }

}
