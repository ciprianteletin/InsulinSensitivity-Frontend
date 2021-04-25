import {NgModule} from '@angular/core';
import {ConfirmModalComponent} from '../components/confirm-modal/confirm-modal.component';
import {DeleteModalComponent} from '../components/delete-modal/delete-modal.component';
import {DeleteIndexModalComponent} from '../components/delete-index-modal/delete-index-modal.component';

@NgModule({
  declarations: [ConfirmModalComponent, DeleteModalComponent, DeleteIndexModalComponent],
  imports: [],
  exports: [ConfirmModalComponent, DeleteModalComponent, DeleteIndexModalComponent]
})
export class ModalModule {

}
