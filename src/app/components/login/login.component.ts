import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../../assets/styles/login-register.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('f') loginForm: NgForm;

  constructor(private authService: AuthenticationService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  login(): void {
    this.authService.login(this.loginForm.value).subscribe(user => {
      this.router.navigate(['/insulin']);
    });
  }

}
