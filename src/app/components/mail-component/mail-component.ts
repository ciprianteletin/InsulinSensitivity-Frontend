import {Component, OnInit, ViewChild} from '@angular/core';
import {ManagePasswordService} from '../../services/manage-password.service';
import {CanLeave} from '../../guards/utils/can.leave';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-mail',
  templateUrl: './mail-component.html',
  styleUrls: ['./mail-component.css', '../../../assets/styles/login-register.css']
})
export class MailComponent implements OnInit, CanLeave {
  @ViewChild('f') emailForm;

  constructor(private passwordManager: ManagePasswordService) {
  }

  ngOnInit(): void {
  }

  sendEmail(): void {
    this.passwordManager.sendEmail(this.emailForm.value.email).subscribe();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.emailForm.value.email === '') {
      return confirm('Do you want to discard the changes?');
    }
    return true;
  }

}
