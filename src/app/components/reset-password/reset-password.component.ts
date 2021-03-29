import {Component, OnInit, ViewChild} from '@angular/core';
import {ManagePasswordService} from '../../services/manage-password.service';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css', '../../../assets/styles/login-register.css']
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild('f') resetForm: NgForm;
  private code: string;

  constructor(private passwordManager: ManagePasswordService,
              private activeRoute: ActivatedRoute,
              private router: Router) {
    activeRoute.params.subscribe(params => {
      this.code = params.code;
    });
  }

  ngOnInit(): void {
  }

  resetPassword(): void {
    this.passwordManager.resetPassword(this.resetForm.value.password, this.code)
      .subscribe(() => {
        this.router.navigate(['/login']);
      });
  }
}
