import {Injectable} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ModalInterface} from '../model/util/modal.interface';
import {Subject, from, Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ModalManagerService {
  private deleteModalRef: NgbModalRef;
  private confirmModalRef: NgbModalRef;

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

  openConfirmModal(component: ModalInterface): void {
    this.confirmModalRef = this.modalService.open(component);
  }

  closeConfirmModal(): void {
    this.confirmModalRef.dismiss();
  }

  onOkPressedConfirmModal(): void {
    this.confirmModalRef.close(true);
  }

  getConfirmResult(): Observable<boolean> {
    return from(this.confirmModalRef.result);
  }
}
