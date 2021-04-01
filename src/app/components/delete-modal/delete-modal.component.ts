import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthenticationService} from '../../services/authentication.service';
import {Subscription} from 'rxjs';
import {ModalManagerService} from '../../services/modal-manager.service';
import {ModalInterface} from '../../model/util/modal.interface';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css'],
  providers: [NgbActiveModal]
})
export class DeleteModalComponent implements OnInit, OnDestroy, ModalInterface {
  username: string;
  userSubscription: Subscription;

  constructor(public modalManager: ModalManagerService,
              private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.user
      .subscribe(user => this.username = user.username);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}
