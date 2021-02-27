import {Component, OnInit, ViewChild} from '@angular/core';
import {ManagePasswordService} from '../../services/manage-password.service';

@Component({
  selector: 'app-mail',
  templateUrl: './mail-component.html',
  styleUrls: ['./mail-component.css', '../../../assets/styles/login-register.css']
})
export class MailComponent implements OnInit {
  @ViewChild('f') emailForm;

  constructor(private passwordManager: ManagePasswordService) {
  }

  ngOnInit(): void {
  }

  sendEmail(): void {
    this.passwordManager.sendEmail(this.emailForm.value.email).subscribe();
  }

}
