import {Component, OnInit} from '@angular/core';
import {ModalManagerService} from '../../services/modal-manager.service';
import {ModalInterface} from '../../model/util/modal.interface';

@Component({
  selector: 'app-delete-index-modal',
  templateUrl: './delete-index-modal.component.html',
  styleUrls: ['./delete-index-modal.component.css']
})
export class DeleteIndexModalComponent implements OnInit, ModalInterface {

  constructor(public modalManager: ModalManagerService) {
  }

  ngOnInit(): void {
  }

}
