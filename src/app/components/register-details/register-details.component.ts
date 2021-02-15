import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RegisterBasicModel} from '../../model/register-basic.model';

@Component({
  selector: 'app-register-details',
  templateUrl: './register-details.component.html',
  styleUrls: ['./register-details.component.css', '../../../assets/styles/login-register.css']
})
export class RegisterDetailsComponent implements OnInit {
  basicDetails: RegisterBasicModel;

  constructor(private router: Router) {
    this.basicDetails = this.router.getCurrentNavigation().extras.state.registerBasic;
  }

  ngOnInit(): void {
  }

}
