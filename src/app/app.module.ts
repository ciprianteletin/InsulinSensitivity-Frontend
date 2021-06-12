import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {PrincipalComponent} from './components/principal/principal.component';
import {InsulinFormComponent} from './components/insulin-form/insulin-form.component';
import {IndexComponent} from './components/index/index.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptorService} from './interceptors/auth-interceptor.service';
import {ErrorInterceptorService} from './interceptors/error-interceptor.service';
import {NotificationsModule} from './configs/notifications.module';
import {CookieService} from 'ngx-cookie-service';
import {AuthenticationModule} from './modules/authentication.module';
import {SharedModule} from './modules/shared.module';
import {ErrorModule} from './modules/error.module';
import {SettingsComponent} from './components/settings/settings.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CredentialsInterceptor} from './interceptors/credentials.interceptor';
import {AppInitService} from './configs/app-init.service';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyBootstrapModule} from '@ngx-formly/bootstrap';
import {isNumber, isPositive, numberMessage} from './validations/form.validation';
import {ResultComponent} from './components/result/result.component';
import {HistoryComponent} from './components/history/history.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ModalModule} from './modules/modal.module';
import {LoggedInGuard} from './guards/logged-in.guard';
import {NotLoggedGuard} from './guards/not-logged.guard';
import {ContactUsComponent} from './components/contact-us/contact-us.component';
import {PredictDiabetesComponent} from './components/predict-diabetes/predict-diabetes.component';
import {PredictEvolutionComponent} from './components/predict-evolution/predict-evolution.component';

export function initApp(appInitService: AppInitService): () => Promise<any> {
  return () => appInitService.init();
}

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    InsulinFormComponent,
    IndexComponent,
    SidebarComponent,
    SettingsComponent,
    ResultComponent,
    HistoryComponent,
    ContactUsComponent,
    PredictDiabetesComponent,
    PredictEvolutionComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthenticationModule,
    ModalModule,
    ErrorModule,
    SharedModule,
    FormsModule,
    NotificationsModule,
    ReactiveFormsModule,
    FormlyBootstrapModule,
    FormlyModule.forRoot({
      extras: {lazyRender: true},
      validators: [
        {name: 'onlyNumber', validation: isNumber},
        {name: 'isPositive', validation: isPositive}
      ],
      validationMessages: [
        {name: 'onlyNumber', message: numberMessage},
        {name: 'required', message: 'This field is required'},
        {name: 'isPositive', message: 'The number must be positive!'}
      ]
    }),
    NgbModule
  ],
  providers: [
    AppInitService,
    {provide: APP_INITIALIZER, useFactory: initApp, deps: [AppInitService], multi: true},
    CookieService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: CredentialsInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true},
    LoggedInGuard, NotLoggedGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
