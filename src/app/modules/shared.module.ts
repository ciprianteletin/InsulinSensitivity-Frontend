import {NgModule} from '@angular/core';
import {LoadingSpinnerComponent} from '../shared/loading-spinner.component';
import {ModalDirective} from '../directives/modal.directive';
import {CommonModule} from '@angular/common';
import {FooterComponent} from '../components/footer/footer.component';
import {HeaderComponent} from '../components/header/header.component';
import {AppRoutingModule} from '../app-routing.module';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    ModalDirective,
    FooterComponent,
    HeaderComponent
  ],
  imports: [CommonModule, AppRoutingModule],
  exports: [
    LoadingSpinnerComponent,
    ModalDirective,
    CommonModule,
    FooterComponent,
    HeaderComponent,
    AppRoutingModule
  ]
})
export class SharedModule {

}
