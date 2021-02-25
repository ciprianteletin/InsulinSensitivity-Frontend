import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FooterComponent} from './components/footer/footer.component';
import {HeaderComponent} from './components/header/header.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {RegisterDetailsComponent} from './components/register-details/register-details.component';
import {PrincipalComponent} from './components/principal/principal.component';
import {InsulinFormComponent} from './components/insulin-form/insulin-form.component';
import {IndexComponent} from './components/index/index.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {ModalDirective} from './directives/modal.directive';
import {FormsModule} from '@angular/forms';
import {ConfirmPasswordValidator} from './directives/confirm-password.directive';
import {OnlyNumbersDirective} from './directives/numbers.directive';
import {LoadingSpinnerComponent} from './shared/loading-spinner.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptorService} from './interceptors/auth-interceptor.service';
import {ErrorModalComponent} from './components/error-modal/error-modal.component';
import {ErrorInterceptorService} from './interceptors/error-interceptor.service';
import { NotFoundComponent } from './components/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    RegisterDetailsComponent,
    PrincipalComponent,
    InsulinFormComponent,
    IndexComponent,
    SidebarComponent,
    ModalDirective,
    ConfirmPasswordValidator,
    OnlyNumbersDirective,
    LoadingSpinnerComponent,
    ErrorModalComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
