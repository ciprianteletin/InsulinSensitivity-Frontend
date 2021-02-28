import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../../assets/styles/login-register.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('f') loginForm: NgForm;
  resetPassword: boolean;
  routerEvent: Subscription;

  constructor(private authService: AuthenticationService,
              private router: Router,
              private activeRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.routerEvent = this.router.events.subscribe(value => {
      this.resetPassword = !(this.router.url.toString() === '/login');
    });
  }

  login(): void {
    this.authService.login(this.loginForm.value).subscribe(user => {
      this.router.navigate(['/insulin']);
    });
  }

  onForgetPassword(): void {
    this.router.navigate(['forget'], {relativeTo: this.activeRoute});
  }

  ngOnDestroy(): void {
    this.routerEvent.unsubscribe();
  }
}
