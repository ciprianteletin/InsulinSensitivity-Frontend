import {Injectable} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ModalInterface} from '../model/util/modal.interface';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ModalManagerService {
  private deleteModalRef: NgbModalRef;
  deleteModalResult = new Subject();

  constructor(private modalService: NgbModal) {
  }

  openDeleteModal(component: ModalInterface): void {
    this.deleteModalRef = this.modalService.open(component, {centered: true});
  }

  closeDeleteModal(): void {
    this.deleteModalRef.dismiss();
  }

  onOkPressedDeleteModal(): void {
    this.deleteModalRef.close(true);
    this.deleteModalResult.next(true);
  }
}
