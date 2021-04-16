import {NgModule} from '@angular/core';
import {LoadingSpinnerComponent} from '../shared/loading-spinner.component';
import {ModalDirective} from '../directives/modal.directive';
import {CommonModule} from '@angular/common';
import {FooterComponent} from '../components/footer/footer.component';
import {ComplexHeaderComponent} from '../components/complex-header/complex-header.component';
import {AppRoutingModule} from '../app-routing.module';
import {HeaderComponent} from '../components/header/header.component';
import {DatePickerComponent} from '../components/utils/date-picker/date-picker.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ChartsModule} from 'ng2-charts';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    ModalDirective,
    FooterComponent,
    ComplexHeaderComponent,
    HeaderComponent,
    DatePickerComponent
  ],
  imports: [CommonModule, AppRoutingModule, NgbModule, ChartsModule],
  exports: [
    LoadingSpinnerComponent,
    ModalDirective,
    CommonModule,
    FooterComponent,
    ComplexHeaderComponent,
    HeaderComponent,
    DatePickerComponent,
    AppRoutingModule,
    ChartsModule
  ]
})
export class SharedModule {

}
