import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalManagerService} from '../../services/modal-manager.service';
import {ModalInterface} from '../../model/util/modal.interface';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-delete-index-modal',
  templateUrl: './delete-index-modal.component.html',
  styleUrls: ['./delete-index-modal.component.css']
})
export class DeleteIndexModalComponent implements OnInit, OnDestroy, ModalInterface {
  strongText: string;
  text: string;
  private textSubscription: Subscription;

  constructor(public modalManager: ModalManagerService) {
  }

  ngOnInit(): void {
    this.textSubscription = this.modalManager.setTextDeleteModalSubject
      .subscribe((data: { t1: string, t2: string }) => {
        this.strongText = data.t1;
        this.text = data.t2;
      });
  }

  ngOnDestroy(): void {
    this.textSubscription.unsubscribe();
  }
}
