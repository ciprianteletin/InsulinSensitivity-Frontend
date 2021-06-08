import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalInterface} from '../../model/util/modal.interface';
import {ModalManagerService} from '../../services/modal-manager.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit, OnDestroy, ModalInterface {
  strongText: string;
  text: string;
  private textSubscription: Subscription;

  constructor(public modalManager: ModalManagerService) {
  }

  ngOnInit(): void {
    this.textSubscription = this.modalManager.setTextConfirmModalSubject
      .subscribe((data: { t1: string, t2: string }) => {
        this.strongText = data.t1;
        this.text = data.t2;
      });
  }

  ngOnDestroy(): void {
    this.textSubscription.unsubscribe();
  }

}
