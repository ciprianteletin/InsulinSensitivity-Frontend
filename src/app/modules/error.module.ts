import {NgModule} from '@angular/core';
import {NotFoundComponent} from '../components/not-found/not-found.component';
import {ErrorModalComponent} from '../components/error-modal/error-modal.component';
import {SharedModule} from './shared.module';

@NgModule({
  declarations: [ErrorModalComponent, NotFoundComponent],
  imports: [SharedModule],
  exports: [ErrorModalComponent, NotFoundComponent]
})
export class ErrorModule {

}
