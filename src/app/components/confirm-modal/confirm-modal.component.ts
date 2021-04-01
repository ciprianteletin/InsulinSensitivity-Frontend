import { Component, OnInit } from '@angular/core';
import {ModalInterface} from '../../model/util/modal.interface';
import {ModalManagerService} from '../../services/modal-manager.service';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit, ModalInterface {

  constructor(public modalManager: ModalManagerService) { }

  ngOnInit(): void {
  }

}
