import {Component, OnInit, ViewChild} from '@angular/core';
import {ManagePasswordService} from '../../services/manage-password.service';
import {CanLeave} from '../../guards/utils/can.leave';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {NotificationService} from '../../services/notification.service';
import {NotificationType} from '../../constants/notification-type.enum';

@Component({
  selector: 'app-mail',
  templateUrl: './mail-component.html',
  styleUrls: ['./mail-component.css', '../../../assets/styles/login-register.css', '../../../assets/styles/modal.css']
})
export class MailComponent implements OnInit, CanLeave {
  @ViewChild('f') emailForm;
  isLoading = false;

  constructor(private passwordManager: ManagePasswordService,
              private router: Router,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
  }

  sendEmail(): void {
    this.isLoading = true;
    this.passwordManager.sendEmail(this.emailForm.value.email).subscribe(() => {
      this.router.navigate(['/']);
      this.isLoading = false;
      this.notificationService.notify(NotificationType.DEFAULT, 'An email for resetting the password was sent!');
    }, error => this.isLoading = false);
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.emailForm.value.email === '') {
      return confirm('Do you want to discard the changes?');
    }
    return true;
  }

}
