import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {RegisterBasicModel} from '../../model/register-basic.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../../../assets/styles/login-register.css']
})
export class RegisterComponent implements OnInit {
  @ViewChild('f') registerForm: NgForm;

  constructor(private router: Router) {
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
}
