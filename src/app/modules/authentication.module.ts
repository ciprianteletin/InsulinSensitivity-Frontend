import {NgModule} from '@angular/core';
import {LoginComponent} from '../components/login/login.component';
import {RegisterComponent} from '../components/register/register.component';
import {RegisterDetailsComponent} from '../components/register-details/register-details.component';
import {ResetPasswordComponent} from '../components/reset-password/reset-password.component';
import {MailComponent} from '../components/mail-component/mail-component';
import {OnlyNumbersDirective} from '../directives/numbers.directive';
import {ConfirmPasswordValidator} from '../directives/confirm-password.directive';
import {SharedModule} from './shared.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    RegisterDetailsComponent,
    ResetPasswordComponent,
    MailComponent,
    OnlyNumbersDirective,
    ConfirmPasswordValidator
  ],
  imports: [SharedModule, FormsModule],
  exports: [
    LoginComponent,
    RegisterComponent,
    RegisterDetailsComponent,
    ResetPasswordComponent,
    MailComponent
  ]
})
export class AuthenticationModule {

}
