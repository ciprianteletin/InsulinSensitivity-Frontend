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
import {ResultSortPipe} from '../pipes/result-sort.pipe';
import {IndexSortPipe} from '../pipes/index-sort.pipe';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    ModalDirective,
    FooterComponent,
    ComplexHeaderComponent,
    HeaderComponent,
    DatePickerComponent,
    ResultSortPipe,
    IndexSortPipe
  ],
  imports: [CommonModule, AppRoutingModule, NgbModule, ChartsModule,  NgMultiSelectDropDownModule.forRoot()],
  exports: [
    LoadingSpinnerComponent,
    ModalDirective,
    CommonModule,
    FooterComponent,
    ComplexHeaderComponent,
    HeaderComponent,
    DatePickerComponent,
    AppRoutingModule,
    ChartsModule,
    ResultSortPipe,
    IndexSortPipe,
    NgMultiSelectDropDownModule
  ]
})
export class SharedModule {

}
