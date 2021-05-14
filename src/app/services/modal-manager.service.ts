import {Injectable} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ModalInterface} from '../model/util/modal.interface';
import {Subject, from, Observable, BehaviorSubject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ModalManagerService {
  private deleteModalRef: NgbModalRef;
  private confirmModalRef: NgbModalRef;
  private deleteIndexRef: NgbModalRef;

  deleteAccModalResult = new Subject<boolean>();
  deleteIndexModalResult = new Subject<boolean>();
  setTextDeleteModalSubject = new BehaviorSubject<{ t1: string, t2: string }>(null);

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
    this.deleteAccModalResult.next(true);
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

  openDeleteIndexModal(component: ModalInterface, strongText: string, text: string): void {
    this.deleteIndexRef = this.modalService.open(component, {centered: true});
    this.setTextDeleteModalSubject.next({t1: strongText, t2: text});
  }

  onOkDeleteIndexModal(): void {
    this.deleteIndexRef.close(true);
    this.deleteIndexModalResult.next(true);
  }

  closeDeleteIndexModal(): void {
    this.deleteIndexRef.dismiss();
  }

  getConfirmResult(): Observable<boolean> {
    return from(this.confirmModalRef.result);
  }
}
