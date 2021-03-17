import {NgModule} from '@angular/core';
import {LoadingSpinnerComponent} from '../shared/loading-spinner.component';
import {ModalDirective} from '../directives/modal.directive';
import {CommonModule} from '@angular/common';
import {FooterComponent} from '../components/footer/footer.component';
import {ComplexHeaderComponent} from '../components/complex-header/complex-header.component';
import {AppRoutingModule} from '../app-routing.module';
import {HeaderComponent} from '../components/header/header.component';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    ModalDirective,
    FooterComponent,
    ComplexHeaderComponent,
    HeaderComponent
  ],
  imports: [CommonModule, AppRoutingModule],
  exports: [
    LoadingSpinnerComponent,
    ModalDirective,
    CommonModule,
    FooterComponent,
    ComplexHeaderComponent,
    HeaderComponent,
    AppRoutingModule
  ]
})
export class SharedModule {

}
