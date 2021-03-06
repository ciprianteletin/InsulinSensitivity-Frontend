import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PrincipalComponent} from './components/principal/principal.component';
import {InsulinFormComponent} from './components/insulin-form/insulin-form.component';
import {IndexComponent} from './components/index/index.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptorService} from './interceptors/auth-interceptor.service';
import {ErrorModalComponent} from './components/error-modal/error-modal.component';
import {ErrorInterceptorService} from './interceptors/error-interceptor.service';
import { NotFoundComponent } from './components/not-found/not-found.component';
import {NotificationsModule} from './configs/notifications.module';
import {CookieService} from 'ngx-cookie-service';
import {AuthenticationModule} from './modules/authentication.module';
import {SharedModule} from './modules/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    InsulinFormComponent,
    IndexComponent,
    SidebarComponent,
    ErrorModalComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthenticationModule,
    SharedModule,
    NotificationsModule
  ],
  providers: [
    CookieService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
